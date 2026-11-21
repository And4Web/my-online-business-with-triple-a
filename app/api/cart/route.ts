
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";

import dbConnect from "../../lib/mongodb";
import { auth } from "../../lib/auth";
import Cart from "../../lib/models/Cart";
import Product from "../../lib/models/Product";

async function getCartData(userId: string) {
  const cart = await Cart.findOne({ userId }).lean();

  if (!cart) {
    return [];
  }

  const productIds = cart.items.map((item) => item.productId);

  const products = await Product.find({
    _id: { $in: productIds },
  })
    .select("_id title slug price category imageUrl status")
    .lean();

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  return cart.items.map((item) => {
    const product = productMap.get(item.productId.toString());

    return {
      productId: item.productId.toString(),
      addedAt: item.addedAt,
      product: product
        ? {
            id: product._id.toString(),
            title: product.title,
            slug: product.slug,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl ?? "",
            status: product.status,
            isAvailable: product.status === "active",
          }
        : null,
    };
  });
}

// GET: Retrieve the signed-in customer's cart.
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    await dbConnect();

    const items = await getCartData(session.user.id);

    return NextResponse.json({
      ok: true,
      items,
      itemCount: items.length,
    });
  } catch (error) {
    console.error("Cart retrieval failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to retrieve your cart." },
      { status: 500 }
    );
  }
}

// POST: Add an active product to the cart.
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json(
        { ok: false, message: "A valid product slug is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const product = await Product.findOne({
      slug: body.slug.trim(),
      status: "active",
    }).select("_id");

    if (!product) {
      return NextResponse.json(
        { ok: false, message: "Product not found or unavailable." },
        { status: 404 }
      );
    }

    const userId = session.user.id;

    // Ensure the customer's cart exists.
    try {
      await Cart.updateOne(
        { userId },
        {
          $setOnInsert: {
            userId,
            items: [],
          },
        },
        { upsert: true }
      );
    } catch (error) {
      // Another simultaneous request may have created the cart.
      if (
        typeof error !== "object" ||
        error === null ||
        !("code" in error) ||
        error.code !== 11000
      ) {
        throw error;
      }
    }

    // Add the product only if it is not already present.
    const updatedCart = await Cart.findOneAndUpdate(
      {
        userId,
        "items.productId": { $ne: product._id },
      },
      {
        $push: {
          items: {
            productId: product._id,
            addedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedCart) {
      return NextResponse.json({
        ok: true,
        message: "This product is already in your cart.",
        items: await getCartData(userId),
      });
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Product added to your cart.",
        items: await getCartData(userId),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Adding product to cart failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to add this product to your cart." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a product from the customer's cart.
export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    if (
      !body ||
      typeof body.productId !== "string" ||
      !mongoose.Types.ObjectId.isValid(body.productId)
    ) {
      return NextResponse.json(
        { ok: false, message: "A valid product ID is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    await Cart.updateOne(
      { userId: session.user.id },
      {
        $pull: {
          items: {
            productId: new mongoose.Types.ObjectId(body.productId),
          },
        },
      }
    );

    const items = await getCartData(session.user.id);

    return NextResponse.json({
      ok: true,
      message: "Product removed from your cart.",
      items,
      itemCount: items.length,
    });
  } catch (error) {
    console.error("Removing product from cart failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to remove this product." },
      { status: 500 }
    );
  }
}
