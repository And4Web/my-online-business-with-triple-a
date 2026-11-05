import mongoose, { Schema } from "mongoose";

export interface IProductDownloadFile {
  storageKey: string;
  fileName: string;
  fileSize: number;
  contentType: "application/zip";
  uploadedAt: Date;
  version: number;
}

export interface IProduct {
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  price: number;
  color: string;
  features: string[];
  imageUrl?: string;
  status: "draft" | "coming-soon" | "active";
  downloadFile?: IProductDownloadFile;
}

const downloadFileSchema = new Schema<IProductDownloadFile>(
  {
    storageKey: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },
    contentType: {
      type: String,
      enum: ["application/zip"],
      default: "application/zip",
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
      required: true,
    },
  },
  {
    _id: false,
  }
);

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
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "coming-soon", "active"],
      default: "draft",
      required: true,
    },
    downloadFile: {
      type: downloadFileSchema,
      required: false,
      default: undefined,
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