import { NextResponse } from "next/server";
import { HeadBucketCommand } from "@aws-sdk/client-s3";

import { requireAdmin } from "../../../lib/require-admin";

import {
  getStorageClient,
  getStorageConfig,
} from "../../../lib/storage/client";


export async function GET(request: Request) {
  const authError = await requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const config = getStorageConfig();
    const client = getStorageClient();

    await client.send(
      new HeadBucketCommand({
        Bucket: config.bucket,
      })
    );

    return NextResponse.json({
      ok: true,
      message: "Backblaze B2 storage connection successful.",
      bucket: config.bucket,
      region: config.region,
    });
  } catch (error) {
    console.error("Backblaze storage connection failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "Could not connect to Backblaze B2. Check the server logs and storage configuration.",
      },
      { status: 500 }
    );
  }
}