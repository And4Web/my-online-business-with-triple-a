
import mongoose, { Schema } from "mongoose";

export interface IProduct {
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  price: number;
  color: string;
  features: string[];
  status: "draft" | "coming-soon" | "active";
}

const productSchema = new Schema<IProduct>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      max: 49,
    },
    color: {
      type: String,
      required: true,
      default: "blue",
    },
    features: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "coming-soon", "active"],
      default: "draft",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);

export default Product;
