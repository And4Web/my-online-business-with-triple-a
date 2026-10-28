import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI ?? "";

if (MONGODB_URI.length === 0) {
  throw new Error("Please add MONGODB_URI to your .env.local file");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // Cache the connection between Next.js development reloads.
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global._mongooseCache ??
  (global._mongooseCache = {
    conn: null,
    promise: null,
  });

export default async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
