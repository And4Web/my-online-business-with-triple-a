
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "../../lib/auth";
import dbConnect from "../../lib/mongodb";
import Invoice from "../../lib/models/Invoice";

export async function GET() {
  try {
    // 1. Verify the customer's login session.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    // 2. Connect to the database.
    await dbConnect();

    // 3. Retrieve only ready invoices belonging to this customer.
    const invoices = await Invoice.find({
      userId: session.user.id,
      status: "ready",
    })
      .select("invoiceNumber orderId")
      .sort({ createdAt: -1 })
      .lean();

    // 4. Return only the information needed by the account page.
    return NextResponse.json(
      {
        ok: true,
        invoices: invoices.map((invoice) => ({
          id: invoice._id.toString(),
          orderId: invoice.orderId.toString(),
          invoiceNumber: invoice.invoiceNumber,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to load your invoices." },
      { status: 500 }
    );
  }
}
