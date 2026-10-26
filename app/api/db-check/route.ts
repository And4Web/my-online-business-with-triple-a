
import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";

// export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json({
      ok: true,
      message: "Connected to MongoDB Atlas successfully!",
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "Database connection failed. Check the server terminal.",
      },
      { status: 500 }
    );
  }
}
