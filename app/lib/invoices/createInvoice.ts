
import "server-only";

import React from "react";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

import {
  renderToBuffer,
  type DocumentProps,
} from "@react-pdf/renderer";

import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import dbConnect from "../mongodb";
import Order from "../models/Order";
import Invoice from "../models/Invoice";
import InvoiceDocument from "./InvoiceDocument";

import {
  getStorageClient,
  getStorageConfig,
} from "../storage/client";

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

function createInvoiceNumber(): string {
  const year = new Date().getFullYear();

  return `INV-${year}-${randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function createInvoiceForPaidOrder(
  input: CreateInvoiceInput
) {
  if (!mongoose.isValidObjectId(input.orderId)) {
    throw new Error("Invalid order ID.");
  }

  if (
    !input.customer.name.trim() ||
    !input.customer.email.trim()
  ) {
    throw new Error("Valid customer details are required.");
  }

  if (
    !(input.paidAt instanceof Date) ||
    Number.isNaN(input.paidAt.getTime())
  ) {
    throw new Error("A valid payment date is required.");
  }

  if (
    input.tax?.applicable &&
    (
      input.tax.taxAmount === undefined ||
      !Number.isFinite(input.tax.taxAmount) ||
      input.tax.taxAmount < 0
    )
  ) {
    throw new Error("A valid tax amount is required.");
  }

  await dbConnect();

  const order = await Order.findById(input.orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus !== "paid") {
    throw new Error(
      "An invoice can only be created for a paid order."
    );
  }

  let invoice = await Invoice.findOne({
    orderId: order._id,
  });

  if (invoice) {
    if (invoice.status === "ready") {
      return invoice;
    }

    if (invoice.status === "generating") {
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
      }
    );

    if (!claimedInvoice) {
      return Invoice.findById(invoice._id);
    }

    invoice = claimedInvoice;
  } else {
    const amount = order.amount;
    const taxApplicable = input.tax?.applicable ?? false;

    const taxAmount = taxApplicable
      ? input.tax?.taxAmount ?? 0
      : 0;

    const invoiceNumber = createInvoiceNumber();
    const year = new Date().getFullYear();

    const storageKey =
      `invoices/${year}/${invoiceNumber}.pdf`;

    try {
      invoice = await Invoice.create({
        invoiceNumber,
        orderId: order._id,
        userId: order.userId,

        seller: {
          name: "and4web.co.in",
          website: "https://and4web.co.in",
          managedBy: "Divine Flame IT Solutions",
        },

        customer: {
          name: input.customer.name.trim(),
          email: input.customer.email.trim().toLowerCase(),
          billingAddress: input.customer.billingAddress?.trim(),
        },

        product: {
          title: order.productTitle,
          slug: order.productSlug,
        },

        payment: {
          amount,
          currency: order.currency,
          status: "paid",
          transactionId: input.transactionId?.trim(),
          paidAt: input.paidAt,
        },

        tax: {
          applicable: taxApplicable,
          taxName: input.tax?.taxName,
          taxRate: input.tax?.taxRate,
          taxAmount,
          totalAmount: amount + taxAmount,
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

    const pdfElement = React.createElement(
      InvoiceDocument,
      {
        invoice: invoiceData,
      }
    ) as unknown as React.ReactElement<DocumentProps>;

    const pdfBuffer = Buffer.from(
      await renderToBuffer(pdfElement)
    );

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
      })
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
          })
        );
      } catch (cleanupError) {
        console.error(
          "Invoice PDF cleanup failed:",
          cleanupError
        );
      }
    }

    try {
      invoice.status = "failed";
      await invoice.save();
    } catch (databaseError) {
      console.error(
        "Invoice failure status update failed:",
        databaseError
      );
    }

    throw new Error("Unable to generate the invoice PDF.");
  }
}
