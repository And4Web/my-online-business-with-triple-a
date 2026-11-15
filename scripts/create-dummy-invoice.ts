
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

import dbConnect from "../app/lib/mongodb";
import Invoice, { type IInvoice } from "../app/lib/models/Invoice";
import InvoiceDocument from "../app/lib/invoices/InvoiceDocument";
import {
  getStorageClient,
  getStorageConfig,
} from "../app/lib/storage/client";

async function main() {
  await dbConnect();

  const now = new Date();
  const invoiceNumber = `TEST-${now.getFullYear()}-${randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;

  const fileName = `${invoiceNumber}.pdf`;
  const storageKey = `invoices/test/${fileName}`;

  const invoiceData: IInvoice = {
    invoiceNumber,
    orderId: new mongoose.Types.ObjectId(),
    userId: "DUMMY-TEST-USER",

    seller: {
      name: "and4web.co.in",
      website: "https://www.and4web.co.in",
      managedBy: "Divine Flame IT Solutions",
    },

    customer: {
      name: "Test Customer (DUMMY)",
      email: "invoice-test@example.invalid",
      billingAddress: "TEST ADDRESS — NOT A REAL CUSTOMER",
    },

    product: {
      title: "TEST ONLY — Sample Nexora Project",
      slug: "dummy-test-project",
    },

    payment: {
      amount: 39,
      currency: "USD",
      status: "paid",
      transactionId: "TEST-TRANSACTION-NOT-REAL",
      paidAt: now,
    },

    tax: {
      applicable: false,
      totalAmount: 39,
    },

    pdf: {
      storageKey,
      fileName,
      contentType: "application/pdf",
      fileSize: 0,
    },

    status: "ready",
    generatedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  const pdfElement = React.createElement(InvoiceDocument, {
    invoice: invoiceData,
  }) as unknown as React.ReactElement<DocumentProps>;

  const pdfBuffer = Buffer.from(await renderToBuffer(pdfElement));

  const storage = getStorageClient();
  const config = getStorageConfig();

  await storage.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: storageKey,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    })
  );

  try {
    const savedInvoice = await Invoice.create({
      ...invoiceData,
      pdf: {
        ...invoiceData.pdf,
        fileSize: pdfBuffer.length,
      },
    });

    console.log("DUMMY INVOICE CREATED SUCCESSFULLY");
    console.log("Invoice ID:", savedInvoice._id.toString());
    console.log("Invoice number:", invoiceNumber);
    console.log("PDF size:", pdfBuffer.length, "bytes");
  } catch (error) {
    await storage.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: storageKey,
      })
    );

    throw error;
  }
}

main()
  .catch((error) => {
    console.error("DUMMY INVOICE TEST FAILED:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
