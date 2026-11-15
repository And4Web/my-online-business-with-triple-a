
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { auth } from "../../../../../lib/auth";
import dbConnect from "../../../../../lib/mongodb";
import Invoice from "../../../../../lib/models/Invoice";
import {
  getStorageClient,
  getStorageConfig,
} from "../../../../../lib/storage/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify the user's session.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    // 2. Validate the invoice ID.
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid invoice ID." },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB.
    await dbConnect();

    // 4. Find the invoice.
    const invoice = await Invoice.findById(id)
      .select("userId status pdf.storageKey pdf.fileName")
      .lean();

    if (!invoice) {
      return NextResponse.json(
        { ok: false, message: "Invoice not found." },
        { status: 404 }
      );
    }

    // 5. Allow only the invoice owner or an administrator.
    const isOwner = invoice.userId === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { ok: false, message: "You are not authorized to download this invoice." },
        { status: 403 }
      );
    }

    // 6. Only ready invoices can be downloaded.
    if (invoice.status !== "ready") {
      return NextResponse.json(
        { ok: false, message: "This invoice is not ready for download." },
        { status: 409 }
      );
    }

    // 7. Validate the private storage key.
    const storageKey = invoice.pdf?.storageKey;

    if (
      !storageKey ||
      !storageKey.startsWith("invoices/") ||
      storageKey.includes("..") ||
      storageKey.includes("\\")
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid invoice storage information." },
        { status: 500 }
      );
    }

    // 8. Prepare a safe PDF filename.
    const fileName =
      (invoice.pdf.fileName || "invoice.pdf")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(0, 150) || "invoice.pdf";

    // 9. Generate a temporary private download URL.
    const config = getStorageConfig();

    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: storageKey,
      ResponseContentType: "application/pdf",
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });

    const url = await getSignedUrl(
      getStorageClient(),
      command,
      { expiresIn: 60 }
    );

    return NextResponse.json(
      { ok: true, url },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Invoice download failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to download this invoice." },
      { status: 500 }
    );
  }
}
