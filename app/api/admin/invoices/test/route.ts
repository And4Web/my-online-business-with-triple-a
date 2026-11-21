//************/ for Indian User *******************
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// import dbConnect from "../../../../lib/mongodb";
// import Order from "../../../../lib/models/Order";
// import Invoice from "../../../../lib/models/Invoice";
// import { requireAdmin } from "../../../../lib/require-admin";
// import { createInvoiceForPaidOrder } from "../../../../lib/invoices/createInvoice";

// import { DeleteObjectCommand } from "@aws-sdk/client-s3";

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
//     const firstProductId = new mongoose.Types.ObjectId();
//     const secondProductId = new mongoose.Types.ObjectId();

//     order = await Order.create({
//       userId: TEST_USER_ID,

//       // Legacy single-product fields
//       productId: firstProductId,
//       productTitle: "Dummy E-commerce Project",
//       productSlug: TEST_PRODUCT_SLUG,

//       // New multi-item invoice data
//       items: [
//         {
//           productId: firstProductId,
//           productTitle: "Dummy E-commerce Project",
//           productSlug: "dummy-ecommerce-project",
//           price: 29,
//         },
//         {
//           productId: secondProductId,
//           productTitle: "Dummy Chat Application",
//           productSlug: "dummy-chat-application",
//           price: 10,
//         },
//       ],

//       subtotal: 39,

//       tax: {
//         country: "India",
//         treatment: "domestic",
//         applicable: true,
//         taxName: "GST",
//         taxRate: 18,
//         taxAmount: 7.02,
//       },

//       customer: {
//         fullName: "Test Customer",
//         address: "Dummy Test Address, Prayagraj, Uttar Pradesh",
//         country: "India",
//       },

//       amount: 46.02,
//       currency: "USD",
//       paymentStatus: "paid",
//     });

//     const invoice = await createInvoiceForPaidOrder({
//       orderId: order._id.toString(),

//       customer: {
//         name: "Test Customer",
//         email: "dummy-customer@example.com",
//         billingAddress:
//           "Dummy Test Address, Prayagraj, Uttar Pradesh",
//       },

//       paidAt: new Date(),
//       transactionId: "DUMMY-GST-TEST-TRANSACTION-2026",
//     });

//     if (invoice.status !== "ready") {
//       throw new Error("The dummy invoice PDF is not ready.");
//     }

//     return NextResponse.json({
//       ok: true,
//       message: "Dummy GST invoice generated successfully.",
//       invoiceNumber: invoice.invoiceNumber,
//       invoiceId: invoice._id.toString(),
//       orderId: order._id.toString(),
//       calculation: {
//         subtotal: 39,
//         gstRate: "18%",
//         gstAmount: 7.02,
//         total: 46.02,
//         currency: "USD",
//       },
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




// **************For International users**********************



import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
import Invoice from "../../../../lib/models/Invoice";
import { requireAdmin } from "../../../../lib/require-admin";
import { createInvoiceForPaidOrder } from "../../../../lib/invoices/createInvoice";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import {
  getStorageClient,
  getStorageConfig,
} from "../../../../lib/storage/client";

const TEST_USER_ID = "DUMMY-TEST-USER-LUT-2026";
const TEST_PRODUCT_SLUG = "dummy-lut-invoice-test";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export async function POST(request: Request) {
  if (isProduction()) {
    return NextResponse.json(
      { ok: false, message: "Testing is disabled in production." },
      { status: 403 }
    );
  }

  const authError = await requireAdmin(request);

  if (authError) {
    return authError;
  }

  await dbConnect();

  const existingOrder = await Order.findOne({
    userId: TEST_USER_ID,
    productSlug: TEST_PRODUCT_SLUG,
  });

  if (existingOrder) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "A dummy invoice test already exists. Delete it before creating another.",
      },
      { status: 409 }
    );
  }

  let order;

  try {
    const firstProductId = new mongoose.Types.ObjectId();
    const secondProductId = new mongoose.Types.ObjectId();

    order = await Order.create({
      userId: TEST_USER_ID,

      // Legacy single-product fields
      productId: firstProductId,
      productTitle: "Dummy E-commerce Project",
      productSlug: TEST_PRODUCT_SLUG,

      // Multi-product invoice items
      items: [
        {
          productId: firstProductId,
          productTitle: "Dummy E-commerce Project",
          productSlug: "dummy-ecommerce-project",
          price: 29,
        },
        {
          productId: secondProductId,
          productTitle: "Dummy Chat Application",
          productSlug: "dummy-chat-application",
          price: 10,
        },
      ],

      subtotal: 39,

      // International export test under LUT
      tax: {
        country: "United States",
        treatment: "international",
        applicable: false,
        taxName: "Export under LUT",
        taxRate: 0,
        taxAmount: 0,
        lutApplied: true,
      },

      customer: {
        fullName: "International Test Customer",
        address: "123 Test Street, New York",
        country: "United States",
      },

      amount: 39,
      currency: "USD",
      paymentStatus: "paid",
    });

    const invoice = await createInvoiceForPaidOrder({
      orderId: order._id.toString(),

      customer: {
        name: "International Test Customer",
        email: "international-test@example.com",
        billingAddress: "123 Test Street, New York",
      },

      paidAt: new Date(),
      transactionId: "DUMMY-LUT-EXPORT-TEST-2026",
    });

    if (invoice.status !== "ready") {
      throw new Error("The dummy invoice PDF is not ready.");
    }

    return NextResponse.json({
      ok: true,
      message: "International LUT invoice generated successfully.",
      invoiceNumber: invoice.invoiceNumber,
      invoiceId: invoice._id.toString(),
      orderId: order._id.toString(),

      calculation: {
        subtotal: 39,
        exportTaxRate: "0%",
        exportTaxAmount: 0,
        total: 39,
        currency: "USD",
      },

      lut: {
        applied: invoice.tax.lutApplied,
        arn: "AD091126020350M",
        date: "19/11/2026",
      },

      note: "Open Admin Dashboard > Invoices to inspect the PDF.",
    });
  } catch (error) {
    console.error("Dummy LUT invoice test failed:", error);

    if (order) {
      try {
        const failedInvoice = await Invoice.findOne({
          orderId: order._id,
        });

        if (failedInvoice?.pdf?.storageKey) {
          const config = getStorageConfig();
          const client = getStorageClient();

          await client.send(
            new DeleteObjectCommand({
              Bucket: config.bucket,
              Key: failedInvoice.pdf.storageKey,
            })
          );
        }

        if (failedInvoice) {
          await Invoice.deleteOne({ _id: failedInvoice._id });
        }

        await Order.deleteOne({ _id: order._id });
      } catch (cleanupError) {
        console.error(
          "Dummy LUT invoice cleanup failed:",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Unable to generate the dummy LUT invoice.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (isProduction()) {
    return NextResponse.json(
      { ok: false, message: "Testing is disabled in production." },
      { status: 403 }
    );
  }

  const authError = await requireAdmin(request);

  if (authError) {
    return authError;
  }

  await dbConnect();

  const order = await Order.findOne({
    userId: TEST_USER_ID,
    productSlug: TEST_PRODUCT_SLUG,
  });

  if (!order) {
    return NextResponse.json(
      {
        ok: false,
        message: "No dummy test order was found.",
      },
      { status: 404 }
    );
  }

  const invoice = await Invoice.findOne({
    orderId: order._id,
    userId: TEST_USER_ID,
  });

  if (invoice?.pdf?.storageKey) {
    const config = getStorageConfig();
    const client = getStorageClient();

    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: invoice.pdf.storageKey,
      })
    );
  }

  if (invoice) {
    await Invoice.deleteOne({ _id: invoice._id });
  }

  await Order.deleteOne({ _id: order._id });

  return NextResponse.json({
    ok: true,
    message: "Dummy invoice, PDF and order deleted successfully.",
    invoiceNumber: invoice?.invoiceNumber ?? null,
  });
}
