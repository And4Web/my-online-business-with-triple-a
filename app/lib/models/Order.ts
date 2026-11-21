
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

export interface IOrder {
  userId: string;

  // Legacy single-product fields.
  // For new multi-product orders, these represent the first item.
  productId: mongoose.Types.ObjectId;
  productTitle: string;
  productSlug: string;

  // New multi-product order fields.
  items?: IOrderItem[];
  customer?: IOrderCustomer;

  // Combined order total.
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
  {
    _id: false,
  }
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
  {
    _id: false,
  }
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

    // New orders store all purchased products here.
    // Existing orders continue working with their legacy fields.
    items: {
      type: [OrderItemSchema],
      default: undefined,
    },

    customer: {
      type: OrderCustomerSchema,
      required: false,
    },

    // The order total may exceed $49.
    // Each individual product is still limited to $49.
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
  {
    timestamps: true,
  }
);

OrderSchema.index(
  { userId: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: { $type: "string" },
    },
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
