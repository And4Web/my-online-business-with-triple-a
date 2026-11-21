
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// import dbConnect from "../../../../lib/mongodb";
// import Order from "../../../../lib/models/Order";
// import Invoice from "../../../../lib/models/Invoice";
// import { requireAdmin } from "../../../../lib/require-admin";
// import { createInvoiceForPaidOrder } from "../../../../lib/invoices/createInvoice";

// import {
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";

// import {
//   getStorageClient,
//   getStorageConfig,
// } from "../../../../lib/storage/client";

// const TEST_USER_ID = "DUMMY-TEST-USER-LUT-2026";
// const TEST_PRODUCT_SLUG = "dummy-lut-invoice-test";

// function isProduction() {
//   return process.env.NODE_ENV === "production";
// }

// export async function POST(request: Request) {
//   if (isProduction()) {
//     return NextResponse.json(
//       { ok: false, message: "Testing is disabled in production." },
//       { status: 403 }
//     );
//   }

//   const authError = await requireAdmin(request);

//   if (authError) {
//     return authError;
//   }

//   await dbConnect();

//   const existingOrder = await Order.findOne({
//     userId: TEST_USER_ID,
//     productSlug: TEST_PRODUCT_SLUG,
//   });

//   if (existingOrder) {
//     return NextResponse.json(
//       {
//         ok: false,
//         message:
//           "A dummy invoice test already exists. Clean it up before creating another.",
//       },
//       { status: 409 }
//     );
//   }

//   let order;

//   try {
//     order = await Order.create({
//       userId: TEST_USER_ID,
//       productId: new mongoose.Types.ObjectId(),
//       productTitle: "Dummy LUT Invoice Test Product",
//       productSlug: TEST_PRODUCT_SLUG,
//       amount: 39,
//       currency: "USD",
//       paymentStatus: "paid",
//     });

//     const invoice = await createInvoiceForPaidOrder({
//       orderId: order._id.toString(),

//       customer: {
//         name: "Test Customer",
//         email: "dummy-customer@example.com",
//         billingAddress: "Dummy Test Address",
//       },

//       paidAt: new Date(),
//       transactionId: "DUMMY-TEST-TRANSACTION-LUT-2026",
//     });

//     if (invoice.status !== "ready") {
//       throw new Error("The dummy invoice PDF is not ready.");
//     }

//     return NextResponse.json({
//       ok: true,
//       message: "Dummy invoice generated successfully.",
//       invoiceNumber: invoice.invoiceNumber,
//       invoiceId: invoice._id.toString(),
//       orderId: order._id.toString(),
//       note: "Open Admin Dashboard > Invoices to inspect the PDF.",
//     });
//   } catch (error) {
//     console.error("Dummy invoice test failed:", error);

//     if (order) {
//       try {
//         const failedInvoice = await Invoice.findOne({
//           orderId: order._id,
//         });

//         if (failedInvoice?.pdf?.storageKey) {
//           const config = getStorageConfig();
//           const client = getStorageClient();

//           await client.send(
//             new DeleteObjectCommand({
//               Bucket: config.bucket,
//               Key: failedInvoice.pdf.storageKey,
//             })
//           );
//         }

//         if (failedInvoice) {
//           await Invoice.deleteOne({ _id: failedInvoice._id });
//         }

//         await Order.deleteOne({ _id: order._id });
//       } catch (cleanupError) {
//         console.error(
//           "Dummy invoice test cleanup failed:",
//           cleanupError
//         );
//       }
//     }

//     return NextResponse.json(
//       {
//         ok: false,
//         message: "Unable to generate the dummy invoice.",
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: Request) {
//   if (isProduction()) {
//     return NextResponse.json(
//       { ok: false, message: "Testing is disabled in production." },
//       { status: 403 }
//     );
//   }

//   const authError = await requireAdmin(request);

//   if (authError) {
//     return authError;
//   }

//   await dbConnect();

//   const order = await Order.findOne({
//     userId: TEST_USER_ID,
//     productSlug: TEST_PRODUCT_SLUG,
//   });

//   if (!order) {
//     return NextResponse.json(
//       {
//         ok: false,
//         message: "No dummy test order was found.",
//       },
//       { status: 404 }
//     );
//   }

//   const invoice = await Invoice.findOne({
//     orderId: order._id,
//     userId: TEST_USER_ID,
//   });

//   if (invoice?.pdf?.storageKey) {
//     const config = getStorageConfig();
//     const client = getStorageClient();

//     await client.send(
//       new DeleteObjectCommand({
//         Bucket: config.bucket,
//         Key: invoice.pdf.storageKey,
//       })
//     );
//   }

//   if (invoice) {
//     await Invoice.deleteOne({ _id: invoice._id });
//   }

//   await Order.deleteOne({ _id: order._id });

//   return NextResponse.json({
//     ok: true,
//     message: "Dummy invoice, PDF and order deleted successfully.",
//     invoiceNumber: invoice?.invoiceNumber ?? null,
//   });
// }
