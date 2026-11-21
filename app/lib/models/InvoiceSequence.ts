
import mongoose, { Schema, type Model } from "mongoose";

export interface IInvoiceSequence {
  financialYear: string;
  lastNumber: number;
}

const InvoiceSequenceSchema = new Schema<IInvoiceSequence>(
  {
    financialYear: {
      type: String,
      required: true,
      unique: true,
    },
    lastNumber: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const InvoiceSequence: Model<IInvoiceSequence> =
  mongoose.models.InvoiceSequence ||
  mongoose.model<IInvoiceSequence>(
    "InvoiceSequence",
    InvoiceSequenceSchema
  );

export default InvoiceSequence;
