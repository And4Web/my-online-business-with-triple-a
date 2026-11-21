import "server-only";

import React from "react";
import mongoose from "mongoose";

import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import dbConnect from "../mongodb";
import Order from "../models/Order";
import Invoice from "../models/Invoice";
import InvoiceDocument from "./InvoiceDocument";

import { createInvoiceNumber } from "./createInvoiceNumber";
import { BUSINESS_CONFIG, BUSINESS_ADDRESS } from "./business-config";

import { getStorageClient, getStorageConfig } from "../storage/client";

type CreateInvoiceInput = {
  orderId: string;

  customer: {
    name: string;
    email: string;
    billingAddress?: string;
  };

  paidAt: Date;
  transactionId?: string;

  tax?: {
    applicable: boolean;
    taxName?: string;
    taxRate?: number;
    taxAmount?: number;
  };
};

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function createInvoiceForPaidOrder(input: CreateInvoiceInput) {
  if (!mongoose.isValidObjectId(input.orderId)) {
    throw new Error("Invalid order ID.");
  }

  if (!input.customer.name.trim() || !input.customer.email.trim()) {
    throw new Error("Valid customer details are required.");
  }

  if (!(input.paidAt instanceof Date) || Number.isNaN(input.paidAt.getTime())) {
    throw new Error("A valid payment date is required.");
  }

  await dbConnect();

  const order = await Order.findById(input.orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus !== "paid") {
    throw new Error("An invoice can only be created for a paid order.");
  }

  let invoice = await Invoice.findOne({
    orderId: order._id,
  });

  if (invoice) {
    if (invoice.status === "ready" || invoice.status === "generating") {
      return invoice;
    }

    const claimedInvoice = await Invoice.findOneAndUpdate(
      {
        _id: invoice._id,
        status: "failed",
      },
      {
        $set: {
          status: "generating",
        },
      },
      {
        new: true,
      },
    );

    if (!claimedInvoice) {
      return Invoice.findById(invoice._id);
    }

    invoice = claimedInvoice;
  } else {
    // Checkout stores the final amount, including any applicable tax.
    const amount = order.amount;

    // Use the tax snapshot saved during checkout.
    const savedTax = order.tax;

    const taxApplicable =
      savedTax?.applicable ?? input.tax?.applicable ?? false;

    const taxName = savedTax?.taxName ?? input.tax?.taxName;

    const taxRate = savedTax?.taxRate ?? input.tax?.taxRate;

    const taxAmount = savedTax?.taxAmount ?? input.tax?.taxAmount ?? 0;

    if (!Number.isFinite(taxAmount) || taxAmount < 0) {
      throw new Error("Invalid saved order tax amount.");
    }

    const subtotal =
      order.subtotal ?? Math.round((amount - taxAmount) * 100) / 100;

    if (subtotal < 0) {
      throw new Error("Invalid order subtotal.");
    }

    // Prefer the multi-item order snapshot.
    // Older single-product orders remain supported.
    const orderItems =
      order.items && order.items.length > 0
        ? order.items.map((item) => ({
            productId: item.productId,
            title: item.productTitle,
            slug: item.productSlug,
            price: item.price,
          }))
        : [
            {
              productId: order.productId,
              title: order.productTitle,
              slug: order.productSlug,
              price: subtotal,
            },
          ];

    // Allocate a GST-compliant sequential invoice number.
    const invoiceNumber = await createInvoiceNumber();

    const financialYear = invoiceNumber.split("/")[1] ?? "unassigned";

    const storageKey = `invoices/${financialYear}/${invoiceNumber}.pdf`;

    try {
      invoice = await Invoice.create({
        invoiceNumber,
        orderId: order._id,
        userId: order.userId,

        seller: {
          name: BUSINESS_CONFIG.tradeName,
          legalName: BUSINESS_CONFIG.legalName,
          website: BUSINESS_CONFIG.website,
          managedBy: BUSINESS_CONFIG.legalName,
          gstin: BUSINESS_CONFIG.gstin,
          sacCode: BUSINESS_CONFIG.sacCode,
          registeredAddress: BUSINESS_ADDRESS,
        },

        customer: {
          name: input.customer.name.trim(),
          email: input.customer.email.trim().toLowerCase(),
          billingAddress:
            input.customer.billingAddress?.trim() ||
            order.customer?.address ||
            undefined,
          country: order.customer?.country || undefined,
        },

        // Keep the first item in the legacy fields.
        product: {
          title: orderItems[0].title,
          slug: orderItems[0].slug,
        },

        // Full list for combined orders.
        items: orderItems,

        payment: {
          amount,
          currency: order.currency,
          status: "paid",
          transactionId: input.transactionId?.trim(),
          paidAt: input.paidAt,
        },

        tax: {
          applicable: taxApplicable,
          country: savedTax?.country || order.customer?.country,
          treatment: savedTax?.treatment,
          taxName,
          taxRate,
          taxAmount,
          subtotal,
          totalAmount: amount,

          // Do not claim LUT treatment until export qualification
          // has been explicitly verified.
          lutApplied:
            savedTax?.lutApplied === true &&
            savedTax?.treatment === "international" &&
            savedTax?.applicable === false &&
            taxRate === 0 &&
            taxAmount === 0,
        },

        pdf: {
          storageKey,
          fileName: `${invoiceNumber}.pdf`,
          contentType: "application/pdf",
          fileSize: 0,
        },

        status: "generating",
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const existingInvoice = await Invoice.findOne({
          orderId: order._id,
        });

        if (existingInvoice) {
          return existingInvoice;
        }
      }

      throw error;
    }
  }

  let uploadedStorageKey: string | null = null;

  try {
    const invoiceData = invoice.toObject();

    const pdfElement = React.createElement(InvoiceDocument, {
      invoice: invoiceData,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfBuffer = Buffer.from(await renderToBuffer(pdfElement));

    if (pdfBuffer.length === 0) {
      throw new Error("Generated invoice PDF is empty.");
    }

    const config = getStorageConfig();
    const client = getStorageClient();

    const storageKey = invoice.pdf.storageKey;

    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: storageKey,
        Body: pdfBuffer,
        ContentLength: pdfBuffer.length,
        ContentType: "application/pdf",
        Metadata: {
          invoiceNumber: invoice.invoiceNumber,
          orderId: order._id.toString(),
          userId: order.userId,
        },
      }),
    );

    uploadedStorageKey = storageKey;

    invoice.pdf.fileSize = pdfBuffer.length;
    invoice.status = "ready";
    invoice.generatedAt = new Date();

    await invoice.save();

    return invoice;
  } catch (error) {
    console.error("Invoice generation failed:", error);

    if (uploadedStorageKey) {
      try {
        const config = getStorageConfig();
        const client = getStorageClient();

        await client.send(
          new DeleteObjectCommand({
            Bucket: config.bucket,
            Key: uploadedStorageKey,
          }),
        );
      } catch (cleanupError) {
        console.error("Invoice PDF cleanup failed:", cleanupError);
      }
    }

    try {
      invoice.status = "failed";
      await invoice.save();
    } catch (databaseError) {
      console.error("Invoice failure status update failed:", databaseError);
    }

    throw new Error("Unable to generate the invoice PDF.");
  }
}
