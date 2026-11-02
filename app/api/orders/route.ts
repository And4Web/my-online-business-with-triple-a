
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import dbConnect from "../../lib/mongodb";
import { auth } from "../../lib/auth";
import Product from "../../lib/models/Product";
import Order from "../../lib/models/Order";

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

    const orders = await Order.find({
      userId: session.user.id,
    })
      .select("productTitle productSlug amount currency paymentStatus createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ok: true,
      orders: orders.map((order) => ({
        id: order._id.toString(),
        productTitle: order.productTitle,
        productSlug: order.productSlug,
        amount: order.amount,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to retrieve orders." },
      { status: 500 }
    );
  }
}

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
    }).select("_id title slug price");

    if (!product) {
      return NextResponse.json(
        { ok: false, message: "Product not found or not available for purchase." },
        { status: 404 }
      );
    }

    const order = await Order.create({
      userId: session.user.id,
      productId: product._id,
      productTitle: product.title,
      productSlug: product.slug,
      amount: product.price,
      currency: "USD",
      paymentStatus: "pending",
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Pending order created successfully.",
        order: {
          id: order._id.toString(),
          productTitle: order.productTitle,
          productSlug: order.productSlug,
          amount: order.amount,
          currency: order.currency,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to create order." },
      { status: 500 }
    );
  }
}
