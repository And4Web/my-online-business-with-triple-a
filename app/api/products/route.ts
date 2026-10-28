import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import Product from "../../lib/models/Product";

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({
      status: { $in: ["active", "coming-soon"] },
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ok: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Products API failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Unable to retrieve products.",
      },
      { status: 500 }
    );
  }
}
