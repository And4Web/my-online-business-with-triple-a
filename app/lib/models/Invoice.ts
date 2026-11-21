
import mongoose, { Schema, type Model } from "mongoose";

export type InvoiceStatus = "generating" | "ready" | "failed";

export interface IInvoiceItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  price: number;
}

export interface IInvoice {
  invoiceNumber: string;

  orderId: mongoose.Types.ObjectId;
  userId: string;

  seller: {
    name: string;
    legalName?: string;
    website: string;
    managedBy: string;
    gstin?: string;
    sacCode?: string;
    registeredAddress?: string;
  };

  customer: {
    name: string;
    email: string;
    billingAddress?: string;
    country?: string;
  };

  // Retained for compatibility with existing invoices.
  product: {
    title: string;
    slug: string;
  };

  // Supports combined multi-product orders.
  items?: IInvoiceItem[];

  payment: {
    amount: number;
    currency: string;
    status: "paid";
    transactionId?: string;
    paidAt: Date;
  };

  tax: {
    applicable: boolean;
    country?: string;
    treatment?: "domestic" | "international";
    taxName?: string;
    taxRate?: number;
    taxAmount?: number;
    subtotal?: number;
    totalAmount: number;
    lutApplied?: boolean;
  };

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

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
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
    price: {
      type: Number,
      required: true,
      min: 1,
      max: 49,
    },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 16,
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
        default: "Divine Flame IT Solutions",
      },
      legalName: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        required: true,
        default: "https://www.and4web.co.in",
      },
      managedBy: {
        type: String,
        required: true,
        default: "Anand Shukla",
      },
      gstin: {
        type: String,
        trim: true,
      },
      sacCode: {
        type: String,
        trim: true,
      },
      registeredAddress: {
        type: String,
        trim: true,
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
      country: {
        type: String,
        trim: true,
      },
    },

    // Kept required for compatibility with existing invoice records.
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

    items: {
      type: [InvoiceItemSchema],
      default: undefined,
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
      country: {
        type: String,
        trim: true,
      },
      treatment: {
        type: String,
        enum: ["domestic", "international"],
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
      subtotal: {
        type: Number,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      lutApplied: {
        type: Boolean,
        default: false,
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

// One invoice per order.
invoiceSchema.index({ orderId: 1 }, { unique: true });

// Efficient customer invoice history.
invoiceSchema.index({ userId: 1, createdAt: -1 });

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", invoiceSchema);

export default Invoice;
