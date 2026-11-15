
import { NextResponse } from "next/server";
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

import dbConnect from "../../../../lib/mongodb";
import Invoice, { type IInvoice } from "../../../../lib/models/Invoice";
import InvoiceDocument from "../../../../lib/invoices/InvoiceDocument";
import { requireAdmin } from "../../../../lib/require-admin";
import {
  getStorageClient,
  getStorageConfig,
} from "../../../../lib/storage/client";

// export const runtime = "nodejs";

export async function POST(request: Request) {
  // Never expose this testing endpoint in production.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, message: "Not found." },
      { status: 404 }
    );
  }

  const authError = await requireAdmin(request);

  if (authError) {
    return authError;
  }

  let storageKey = "";

  try {
    const body = await request.json();

    if (body?.confirm !== "CREATE_DUMMY_INVOICE_ONLY") {
      return NextResponse.json(
        { ok: false, message: "Test confirmation is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const now = new Date();
    const invoiceNumber = `TEST-${now.getFullYear()}-${randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;

    const fileName = `${invoiceNumber}.pdf`;
    storageKey = `invoices/test/${fileName}`;

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
      const invoice = await Invoice.create({
        ...invoiceData,
        pdf: {
          ...invoiceData.pdf,
          fileSize: pdfBuffer.length,
        },
      });

      return NextResponse.json(
        {
          ok: true,
          message: "Dummy invoice created successfully.",
          invoice: {
            id: invoice._id.toString(),
            invoiceNumber: invoice.invoiceNumber,
            fileName,
            fileSize: pdfBuffer.length,
          },
        },
        { status: 201, headers: { "Cache-Control": "no-store" } }
      );
    } catch (error) {
      await storage.send(
        new DeleteObjectCommand({
          Bucket: config.bucket,
          Key: storageKey,
        })
      );

      throw error;
    }
  } catch (error) {
    console.error("Dummy invoice test failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to create the dummy invoice." },
      { status: 500 }
    );
  }
}
