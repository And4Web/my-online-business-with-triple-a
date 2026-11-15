
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { auth } from "../../../../lib/auth";
import dbConnect from "../../../../lib/mongodb";
import Invoice from "../../../../lib/models/Invoice";
import {
  getStorageClient,
  getStorageConfig,
} from "../../../../lib/storage/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    // 1. Verify the login session.
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
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid invoice ID." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 3. Find the invoice.
    const invoice = await Invoice.findById(id).select(
      "userId status pdf"
    );

    if (!invoice) {
      return NextResponse.json(
        { ok: false, message: "Invoice not found." },
        { status: 404 }
      );
    }

    // 4. Allow only the invoice owner or an administrator.
    const isOwner = invoice.userId === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { ok: false, message: "You are not authorized to access this invoice." },
        { status: 403 }
      );
    }

    // 5. Only fully generated invoices can be downloaded.
    if (invoice.status !== "ready") {
      return NextResponse.json(
        { ok: false, message: "Invoice PDF is not ready for download." },
        { status: 409 }
      );
    }

    // 6. Validate the private storage reference.
    const storageKey = invoice.pdf?.storageKey;

    if (
      !storageKey ||
      !storageKey.startsWith("invoices/") ||
      storageKey.includes("..") ||
      storageKey.includes("\\")
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid invoice storage reference." },
        { status: 500 }
      );
    }

    // 7. Create a safe PDF filename.
    const cleanFileName =
      (invoice.pdf.fileName || "invoice.pdf")
        .replace(/\\/g, "/")
        .split("/")
        .pop()
        ?.replace(/[\x00-\x1f\x7f"]/g, "")
        .trim() || "invoice.pdf";

    const encodedFileName = encodeURIComponent(cleanFileName);

    const contentDisposition =
      `attachment; filename="invoice.pdf"; ` +
      `filename*=UTF-8''${encodedFileName}`;

    // 8. Generate a temporary private download URL.
    const config = getStorageConfig();

    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: storageKey,
      ResponseContentType: "application/pdf",
      ResponseContentDisposition: contentDisposition,
    });

    const downloadUrl = await getSignedUrl(
      getStorageClient(),
      command,
      { expiresIn: 60 }
    );

    return NextResponse.json(
      {
        ok: true,
        downloadUrl,
        expiresIn: 60,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to prepare invoice download." },
      { status: 500 }
    );
  }
}
