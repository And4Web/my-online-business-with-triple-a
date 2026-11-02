
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

    if (
      typeof body.idempotencyKey !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(body.idempotencyKey)
    ) {
      return NextResponse.json(
        { ok: false, message: "A valid order request key is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const userId = session.user.id;
    const idempotencyKey = body.idempotencyKey;

    // Return the existing order if this request was already processed.
    const existingOrder = await Order.findOne({
      userId,
      idempotencyKey,
    });

    if (existingOrder) {
      return NextResponse.json({
        ok: true,
        message: "This order request has already been processed.",
        order: {
          id: existingOrder._id.toString(),
          productTitle: existingOrder.productTitle,
          productSlug: existingOrder.productSlug,
          amount: existingOrder.amount,
          currency: existingOrder.currency,
          paymentStatus: existingOrder.paymentStatus,
          createdAt: existingOrder.createdAt,
        },
      });
    }

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

    try {
      const order = await Order.create({
        userId,
        productId: product._id,
        productTitle: product.title,
        productSlug: product.slug,
        amount: product.price,
        currency: "USD",
        paymentStatus: "pending",
        idempotencyKey,
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
    } catch (error) {
      // Handle two identical requests arriving at the same time.
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        const duplicateOrder = await Order.findOne({
          userId,
          idempotencyKey,
        });

        if (duplicateOrder) {
          return NextResponse.json({
            ok: true,
            message: "This order request has already been processed.",
            order: {
              id: duplicateOrder._id.toString(),
              productTitle: duplicateOrder.productTitle,
              productSlug: duplicateOrder.productSlug,
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
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to create order." },
      { status: 500 }
    );
  }
}
