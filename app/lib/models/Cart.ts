
import mongoose, { Schema, type Model } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Cart: Model<ICart> =
  mongoose.models.Cart ||
  mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
