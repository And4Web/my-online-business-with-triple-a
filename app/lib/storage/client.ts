import { S3Client } from "@aws-sdk/client-s3";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getStorageConfig() {
  return {
    endpoint: getRequiredEnv("STORAGE_ENDPOINT"),
    region: getRequiredEnv("STORAGE_REGION"),
    bucket: getRequiredEnv("STORAGE_BUCKET"),
    accessKeyId: getRequiredEnv("STORAGE_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("STORAGE_SECRET_ACCESS_KEY"),
  };
}

let storageClient: S3Client | null = null;

export function getStorageClient(): S3Client {
  if (!storageClient) {
    const config = getStorageConfig();

    storageClient = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return storageClient;
}