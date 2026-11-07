
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Order from "../../../lib/models/Order";
import { requireAdmin } from "../../../lib/require-admin";

export async function GET(request: Request) {
  try {
    // Verify administrator access
    const authError = await requireAdmin(request);

    if (authError) {
      return authError;
    }

    await dbConnect();

    // Retrieve the latest 100 orders
    const ordersPromise = Order.find({})
      .select(
        "userId productId productTitle productSlug amount currency paymentStatus createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // Count all orders and each payment status
    const [
      orders,
      totalOrders,
      pendingOrders,
      paidOrders,
      failedOrders,
      refundedOrders,
    ] = await Promise.all([
      ordersPromise,
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "pending" }),
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ paymentStatus: "failed" }),
      Order.countDocuments({ paymentStatus: "refunded" }),
    ]);

    return NextResponse.json(
      {
        ok: true,
        count: totalOrders,
        statusCounts: {
          pending: pendingOrders,
          paid: paidOrders,
          failed: failedOrders,
          refunded: refundedOrders,
        },
        orders: orders.map((order) => ({
          id: order._id.toString(),
          userId: order.userId,
          productId: order.productId.toString(),
          productTitle: order.productTitle,
          productSlug: order.productSlug,
          amount: order.amount,
          currency: order.currency,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Admin order listing failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Unable to retrieve orders.",
      },
      { status: 500 }
    );
  }
}
