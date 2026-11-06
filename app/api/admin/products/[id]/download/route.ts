
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import dbConnect from "../../../../../lib/mongodb";
import Product from "../../../../../lib/models/Product";
import { requireAdmin } from "../../../../../lib/require-admin";
import {
  getStorageClient,
  getStorageConfig,
} from "../../../../../lib/storage/client";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isZipFile(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;

  return (
    (buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04) ||
    (buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x05 &&
      buffer[3] === 0x06) ||
    (buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x07 &&
      buffer[3] === 0x08)
  );
}

function sanitizeFileName(name: string): string {
  const cleanName = name
    .replace(/\\/g, "/")
    .split("/")
    .pop()!
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim();

  return cleanName.slice(0, 180);
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  const authError = await requireAdmin(request);

  if (authError) return authError;

  let uploadedStorageKey: string | null = null;

  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    await dbConnect();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { ok: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Please select a ZIP file." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ZIP file must be larger than 0 bytes and no larger than 50 MB.",
        },
        { status: 400 }
      );
    }

    const fileName = sanitizeFileName(file.name);

    if (!fileName.toLowerCase().endsWith(".zip")) {
      return NextResponse.json(
        { ok: false, message: "Only ZIP files are allowed." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (!isZipFile(fileBuffer)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "The selected file does not appear to be a valid ZIP archive.",
        },
        { status: 400 }
      );
    }

    const config = getStorageConfig();
    const client = getStorageClient();

    // Store ZIP files inside a folder named after the product slug.
    const storageKey =
      `products/${product.slug}/${randomUUID()}.zip`;

    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: storageKey,
        Body: fileBuffer,
        ContentLength: fileBuffer.length,
        ContentType: "application/zip",
        Metadata: {
          productId: product._id.toString(),
          productSlug: product.slug,
        },
      })
    );

    uploadedStorageKey = storageKey;

    const previousStorageKey = product.downloadFile?.storageKey;

    const nextVersion = (product.downloadFile?.version ?? 0) + 1;

    product.downloadFile = {
      storageKey,
      fileName,
      fileSize: fileBuffer.length,
      contentType: "application/zip",
      uploadedAt: new Date(),
      version: nextVersion,
    };

    await product.save();

    // Remove the previous ZIP after the new one is safely saved.
    if (previousStorageKey) {
      try {
        await client.send(
          new DeleteObjectCommand({
            Bucket: config.bucket,
            Key: previousStorageKey,
          })
        );
      } catch (deleteError) {
        console.error(
          "Previous ZIP cleanup failed:",
          deleteError
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Product ZIP uploaded successfully.",
      file: {
        fileName,
        fileSize: fileBuffer.length,
        uploadedAt: product.downloadFile.uploadedAt,
        version: product.downloadFile.version,
      },
    });
  } catch (error) {
    console.error("Product ZIP upload failed:", error);

    // Clean up the newly uploaded object if the database update fails.
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
        console.error("New ZIP cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Unable to upload the product ZIP file.",
      },
      { status: 500 }
    );
  }
}
