import mongoose, { Schema, type Model } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productTitle: string;
  productSlug: string;
  price: number;
}

export interface IOrderCustomer {
  fullName: string;
  address: string;
  country: string;
}

export interface IOrderTax {
  country: string;
  treatment: "domestic" | "international";
  applicable: boolean;
  taxName: string;
  taxRate: number;
  taxAmount: number;
  lutApplied?: boolean;
}

export interface IOrder {
  userId: string;

  // Legacy single-product fields.
  productId: mongoose.Types.ObjectId;
  productTitle: string;
  productSlug: string;

  // Multi-product order fields.
  items?: IOrderItem[];
  customer?: IOrderCustomer;

  // New tax fields. Optional for older orders.
  subtotal?: number;
  tax?: IOrderTax;

  // Combined payable total, including tax where applicable.
  amount: number;
  currency: string;

  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  idempotencyKey?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
      trim: true,
    },
    productSlug: {
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
  { _id: false },
);

const OrderCustomerSchema = new Schema<IOrderCustomer>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false },
);

const OrderTaxSchema = new Schema<IOrderTax>(
  {
    country: {
      type: String,
      required: true,
      trim: true,
    },
    treatment: {
      type: String,
      enum: ["domestic", "international"],
      required: true,
    },
    applicable: {
      type: Boolean,
      required: true,
    },
    taxName: {
      type: String,
      required: true,
      trim: true,
    },
    taxRate: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    lutApplied: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // Retained for compatibility with existing orders and downloads.
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
      trim: true,
    },
    productSlug: {
      type: String,
      required: true,
      trim: true,
    },

    items: {
      type: [OrderItemSchema],
      default: undefined,
    },

    customer: {
      type: OrderCustomerSchema,
      required: false,
    },

    subtotal: {
      type: Number,
      min: 0,
    },

    tax: {
      type: OrderTaxSchema,
      required: false,
    },

    // The combined order total may exceed $49.
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      required: true,
      default: "USD",
      uppercase: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      required: true,
    },

    idempotencyKey: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

OrderSchema.index(
  { userId: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: { $type: "string" },
    },
  },
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
