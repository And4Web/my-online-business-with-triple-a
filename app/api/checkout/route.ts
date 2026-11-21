
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";

import dbConnect from "../../lib/mongodb";
import { auth } from "../../lib/auth";
import Cart from "../../lib/models/Cart";
import Product from "../../lib/models/Product";
import Order from "../../lib/models/Order";

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

async function clearPurchasedItems(
  userId: string,
  productIds: mongoose.Types.ObjectId[]
) {
  if (productIds.length === 0) return;

  await Cart.updateOne(
    { userId },
    {
      $pull: {
        items: {
          productId: { $in: productIds },
        },
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate the customer.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    // 2. Validate checkout information.
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, message: "Invalid checkout information." },
        { status: 400 }
      );
    }

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";

    const address =
      typeof body.address === "string" ? body.address.trim() : "";

    const country =
      typeof body.country === "string" ? body.country.trim() : "";

    const idempotencyKey =
      typeof body.idempotencyKey === "string"
        ? body.idempotencyKey
        : "";

    if (!fullName || fullName.length > 150) {
      return NextResponse.json(
        { ok: false, message: "Please provide a valid full name." },
        { status: 400 }
      );
    }

    if (!address || address.length > 1000) {
      return NextResponse.json(
        { ok: false, message: "Please provide a valid complete address." },
        { status: 400 }
      );
    }

    if (!country || country.length > 100) {
      return NextResponse.json(
        { ok: false, message: "Please provide a valid destination country." },
        { status: 400 }
      );
    }

    if (!/^[0-9a-f-]{36}$/i.test(idempotencyKey)) {
      return NextResponse.json(
        { ok: false, message: "Invalid checkout request key." },
        { status: 400 }
      );
    }

    await dbConnect();

    const userId = session.user.id;

    // 3. Return an existing order if this checkout was already processed.
    const existingOrder = await Order.findOne({
      userId,
      idempotencyKey,
    });

    if (existingOrder) {
      const purchasedIds =
        existingOrder.items?.map((item) => item.productId) ??
        [existingOrder.productId];

      await clearPurchasedItems(userId, purchasedIds);

      return NextResponse.json({
        ok: true,
        message: "This checkout request has already been processed.",
        order: {
          id: existingOrder._id.toString(),
          amount: existingOrder.amount,
          currency: existingOrder.currency,
          paymentStatus: existingOrder.paymentStatus,
          createdAt: existingOrder.createdAt,
        },
      });
    }

    // 4. Retrieve the customer's cart.
    const cart = await Cart.findOne({ userId }).lean();

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Your cart is empty." },
        { status: 400 }
      );
    }

    const productIds = cart.items.map(
      (item) => item.productId
    );

    // 5. Retrieve current product information from the database.
    const products = await Product.find({
      _id: { $in: productIds },
      status: "active",
    }).select("_id title slug price");

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    // Preserve the cart's original product order.
    const unavailableItems: string[] = [];

    const orderItems = cart.items.map((item) => {
      const product = productMap.get(
        item.productId.toString()
      );

      if (!product) {
        unavailableItems.push(item.productId.toString());
        return null;
      }

      return {
        productId: product._id,
        productTitle: product.title,
        productSlug: product.slug,
        price: product.price,
      };
    });

    if (unavailableItems.length > 0 || orderItems.some((item) => !item)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Some products in your cart are no longer available. Please review your cart.",
          unavailableProductIds: unavailableItems,
        },
        { status: 409 }
      );
    }

    // 6. Calculate the combined total using database prices.
    const validItems = orderItems.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

    const totalAmount = validItems.reduce(
      (total, item) => total + item.price,
      0
    );

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json(
        { ok: false, message: "Unable to calculate the order total." },
        { status: 400 }
      );
    }

    // 7. Create one pending order containing all products.
    try {
      const firstItem = validItems[0];

      const order = await Order.create({
        userId,

        // Legacy fields retained for existing account/download code.
        productId: firstItem.productId,
        productTitle: firstItem.productTitle,
        productSlug: firstItem.productSlug,

        // Complete multi-product order.
        items: validItems,

        customer: {
          fullName,
          address,
          country,
        },

        amount: totalAmount,
        currency: "USD",
        paymentStatus: "pending",
        idempotencyKey,
      });

      // 8. Remove only products included in this order.
      await clearPurchasedItems(
        userId,
        productIds
      );

      return NextResponse.json(
        {
          ok: true,
          message: "Your pending order was created successfully.",
          order: {
            id: order._id.toString(),
            amount: order.amount,
            currency: order.currency,
            paymentStatus: order.paymentStatus,
            items: validItems.map((item) => ({
              productTitle: item.productTitle,
              productSlug: item.productSlug,
              price: item.price,
            })),
            createdAt: order.createdAt,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      // Handle simultaneous requests with the same idempotency key.
      if (isDuplicateKeyError(error)) {
        const duplicateOrder = await Order.findOne({
          userId,
          idempotencyKey,
        });

        if (duplicateOrder) {
          const purchasedIds =
            duplicateOrder.items?.map((item) => item.productId) ??
            [duplicateOrder.productId];

          await clearPurchasedItems(userId, purchasedIds);

          return NextResponse.json({
            ok: true,
            message: "This checkout request has already been processed.",
            order: {
              id: duplicateOrder._id.toString(),
              amount: duplicateOrder.amount,
              currency: duplicateOrder.currency,
              paymentStatus: duplicateOrder.paymentStatus,
              createdAt: duplicateOrder.createdAt,
            },
          });
        }
      }

      throw error;
    }
  } catch (error) {
    console.error("Checkout failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to complete checkout." },
      { status: 500 }
    );
  }
}
