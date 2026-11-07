
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { auth } from "../../../../lib/auth";
import dbConnect from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
import Product from "../../../../lib/models/Product";
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
    // 1. Verify the customer's login session.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    // 2. Validate the order ID.
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid order ID." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 3. Find this order belonging to the signed-in customer.
    const order = await Order.findOne({
      _id: id,
      userId: session.user.id,
    }).select("productId paymentStatus");

    if (!order) {
      return NextResponse.json(
        { ok: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // 4. Only verified paid orders can download.
    if (order.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          ok: false,
          message: "Payment must be completed before downloading.",
        },
        { status: 403 }
      );
    }

    // 5. Find the product and its private ZIP metadata.
    const product = await Product.findById(order.productId).select(
      "downloadFile"
    );

    if (!product?.downloadFile?.storageKey) {
      return NextResponse.json(
        { ok: false, message: "Project download is unavailable." },
        { status: 404 }
      );
    }

    const { storageKey, fileName } = product.downloadFile;

    // 6. Validate the stored key before accessing private storage.
    if (
      !storageKey.startsWith("products/") ||
      storageKey.includes("..") ||
      storageKey.includes("\\")
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid project storage reference." },
        { status: 500 }
      );
    }

    // 7. Create a safe download filename.
    const cleanFileName =
      (fileName || "nexora-project.zip")
        .replace(/\\/g, "/")
        .split("/")
        .pop()
        ?.replace(/[\x00-\x1f\x7f"]/g, "")
        .trim() || "nexora-project.zip";

    const encodedFileName = encodeURIComponent(cleanFileName);

    const contentDisposition =
      `attachment; filename="nexora-project.zip"; ` +
      `filename*=UTF-8''${encodedFileName}`;

    // 8. Generate a temporary private download link.
    const config = getStorageConfig();

    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: storageKey,
      ResponseContentType: "application/zip",
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
      { ok: false, message: "Unable to prepare project download." },
      { status: 500 }
    );
  }
}
