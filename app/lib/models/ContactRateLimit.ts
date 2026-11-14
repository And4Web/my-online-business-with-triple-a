
import mongoose, { Schema, type Model } from "mongoose";

export interface IContactRateLimit {
  _id: string;
  count: number;
  windowStartedAt: Date;
  expiresAt: Date;
}

const ContactRateLimitSchema = new Schema<IContactRateLimit>(
  {
    _id: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    windowStartedAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

// Automatically delete expired rate-limit records.
ContactRateLimitSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const ContactRateLimit: Model<IContactRateLimit> =
  mongoose.models.ContactRateLimit ||
  mongoose.model<IContactRateLimit>(
    "ContactRateLimit",
    ContactRateLimitSchema
  );

export default ContactRateLimit;
