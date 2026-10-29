
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please configure MONGODB_URI in .env.local");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("Please configure BETTER_AUTH_SECRET in .env.local");
}

declare global {
  var _betterAuthMongoClient: MongoClient | undefined;
}

const client =
  global._betterAuthMongoClient ??
  new MongoClient(MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  global._betterAuthMongoClient = client;
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db(), {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [admin()],
});
