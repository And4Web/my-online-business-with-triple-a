
import mongoose, { Schema, type Model } from "mongoose";

export type InvoiceStatus = "generating" | "ready" | "failed";

export interface IInvoice {
  invoiceNumber: string;

  // One invoice belongs to exactly one order.
  orderId: mongoose.Types.ObjectId;
  userId: string;

  // Seller identity captured when the invoice is created.
  seller: {
    name: string;
    website: string;
    managedBy: string;
  };

  // Customer details captured at invoice creation.
  customer: {
    name: string;
    email: string;
    billingAddress?: string;
  };

  // Product and transaction snapshot.
  product: {
    title: string;
    slug: string;
  };

  payment: {
    amount: number;
    currency: string;
    status: "paid";
    transactionId?: string;
    paidAt: Date;
  };

  // Tax fields remain optional until the actual tax treatment
  // has been verified.
  tax: {
    applicable: boolean;
    taxName?: string;
    taxRate?: number;
    taxAmount?: number;
    totalAmount: number;
  };

  // Private Backblaze B2 PDF storage information.
  pdf: {
    storageKey: string;
    fileName: string;
    contentType: string;
    fileSize: number;
  };

  status: InvoiceStatus;

  generatedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    seller: {
      name: {
        type: String,
        required: true,
        default: "and4web.co.in",
      },
      website: {
        type: String,
        required: true,
        default: "https://and4web.co.in",
      },
      managedBy: {
        type: String,
        required: true,
        default: "Divine Flame IT Solutions",
      },
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      billingAddress: {
        type: String,
        trim: true,
      },
    },

    product: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      slug: {
        type: String,
        required: true,
        trim: true,
      },
    },

    payment: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },
      status: {
        type: String,
        enum: ["paid"],
        required: true,
      },
      transactionId: {
        type: String,
        trim: true,
      },
      paidAt: {
        type: Date,
        required: true,
      },
    },

    tax: {
      applicable: {
        type: Boolean,
        required: true,
        default: false,
      },
      taxName: {
        type: String,
        trim: true,
      },
      taxRate: {
        type: Number,
        min: 0,
      },
      taxAmount: {
        type: Number,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    pdf: {
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
      contentType: {
        type: String,
        required: true,
        default: "application/pdf",
      },
      fileSize: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    status: {
      type: String,
      enum: ["generating", "ready", "failed"],
      default: "generating",
      required: true,
    },

    generatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple invoices from being issued for the same order.
invoiceSchema.index({ orderId: 1 }, { unique: true });

// Quickly retrieve a customer's invoices.
invoiceSchema.index({ userId: 1, createdAt: -1 });

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", invoiceSchema);

export default Invoice;
