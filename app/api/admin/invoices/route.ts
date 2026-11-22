import { connection, NextResponse } from "next/server";

import dbConnect from "../../../lib/mongodb";
import Invoice from "../../../lib/models/Invoice";
import { requireAdmin } from "../../../lib/require-admin";

export async function GET(request: Request) {
  await connection();
  
  try {
    // 1. Verify administrator access.
    const authError = await requireAdmin(request);

    if (authError) {
      return authError;
    }

    await dbConnect();

    // 2. Retrieve the latest 100 invoices.
    const invoicesPromise = Invoice.find({})
      .select(
        "invoiceNumber orderId userId seller customer product payment.amount payment.currency payment.status payment.transactionId payment.paidAt tax status pdf.fileName createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // 3. Count invoices by generation status.
    const [
      invoices,
      totalInvoices,
      readyInvoices,
      generatingInvoices,
      failedInvoices,
    ] = await Promise.all([
      invoicesPromise,
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: "ready" }),
      Invoice.countDocuments({ status: "generating" }),
      Invoice.countDocuments({ status: "failed" }),
    ]);

    // 4. Return invoice records and statistics.
    return NextResponse.json(
      {
        ok: true,
        count: totalInvoices,
        statusCounts: {
          ready: readyInvoices,
          generating: generatingInvoices,
          failed: failedInvoices,
        },
        invoices: invoices.map((invoice) => ({
          id: invoice._id.toString(),
          invoiceNumber: invoice.invoiceNumber,
          orderId: invoice.orderId.toString(),
          userId: invoice.userId,

          customer: {
            name: invoice.customer.name,
            email: invoice.customer.email,
          },

          product: {
            title: invoice.product.title,
            slug: invoice.product.slug,
          },

          payment: {
            amount: invoice.payment.amount,
            currency: invoice.payment.currency,
            paidAt: invoice.payment.paidAt,
          },

          tax: {
            applicable: invoice.tax.applicable,
            taxAmount: invoice.tax.taxAmount,
            totalAmount: invoice.tax.totalAmount,
          },

          status: invoice.status,
          fileName: invoice.pdf.fileName,
          createdAt: invoice.createdAt,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Admin invoice listing failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Unable to retrieve invoices.",
      },
      { status: 500 },
    );
  }
}
