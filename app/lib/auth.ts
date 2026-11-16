
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

const isProduction = process.env.NODE_ENV === "production";

declare global {
  var _betterAuthMongoClient: MongoClient | undefined;
}

const client =
  global._betterAuthMongoClient ??
  new MongoClient(MONGODB_URI);

if (!isProduction) {
  global._betterAuthMongoClient = client;
}

export const auth = betterAuth({
  // Explicit application URL
  baseURL: isProduction
    ? "https://www.and4web.co.in"
    : "http://localhost:3000",

  // Only allow requests from our approved website origins
  trustedOrigins: isProduction
    ? [
        "https://www.and4web.co.in",
        "https://and4web.co.in",
      ]
    : [
        "http://localhost:3000",
        "https://www.and4web.co.in",
        "https://and4web.co.in",
      ],

  database: mongodbAdapter(client.db(), {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [admin()],
});
