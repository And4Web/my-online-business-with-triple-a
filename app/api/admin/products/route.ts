
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Product from "../../../lib/models/Product";
import { requireAdmin } from "../../../lib/require-admin";

const allowedStatuses = ["draft", "coming-soon", "active"];

function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) {
    return false;
  }

  if (value.trim() === "") {
    return true;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const authError = await requireAdmin(request);

  if (authError) return authError;

  try {
    await dbConnect();

    const products = await Product.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ok: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Admin product listing failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Unable to retrieve products.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin(request);

  if (authError) return authError;

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { ok: false, message: "Invalid product data." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const {
      slug,
      title,
      category,
      description,
      technologies,
      price,
      color,
      features,
      status,
      imageUrl,
    } = data;

    // Validate required text fields.
    if (
      typeof slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
      slug.length > 100 ||
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 150 ||
      typeof category !== "string" ||
      !category.trim() ||
      category.length > 80 ||
      typeof description !== "string" ||
      !description.trim() ||
      description.length > 2000
    ) {
      return NextResponse.json(
        { ok: false, message: "Please provide valid product details." },
        { status: 400 }
      );
    }

    // Validate price.
    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 1 ||
      price > 49
    ) {
      return NextResponse.json(
        { ok: false, message: "Price must be between $1 and $49." },
        { status: 400 }
      );
    }

    // Validate technologies.
    if (
      !Array.isArray(technologies) ||
      technologies.length === 0 ||
      technologies.length > 20 ||
      !technologies.every(
        (item) =>
          typeof item === "string" &&
          item.trim().length > 0 &&
          item.length <= 50
      )
    ) {
      return NextResponse.json(
        { ok: false, message: "Please provide valid technologies." },
        { status: 400 }
      );
    }

    // Validate features.
    if (
      features !== undefined &&
      (
        !Array.isArray(features) ||
        features.length > 30 ||
        !features.every(
          (item) =>
            typeof item === "string" &&
            item.trim().length > 0 &&
            item.length <= 200
        )
      )
    ) {
      return NextResponse.json(
        { ok: false, message: "Please provide valid features." },
        { status: 400 }
      );
    }

    // Validate image URL.
if (!isValidImageUrl(imageUrl ?? "")) {
  return NextResponse.json(
    {
      ok: false,
      message: "Please provide a valid HTTPS image URL.",
    },
    { status: 400 }
  );
}

const productImageUrl =
  typeof imageUrl === "string" ? imageUrl.trim() : "";

    // Validate status.
    const productStatus = status ?? "draft";

    if (
      typeof productStatus !== "string" ||
      !allowedStatuses.includes(productStatus)
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid product status." },
        { status: 400 }
      );
    }

    // Validate color.
    const productColor = color ?? "blue";

    if (
      typeof productColor !== "string" ||
      !/^[a-zA-Z0-9-]{1,30}$/.test(productColor)
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid product color." },
        { status: 400 }
      );
    }

    await dbConnect();

    const product = await Product.create({
      slug: slug.trim(),
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      technologies: technologies.map((item: string) => item.trim()),
      price,
      color: productColor,
      features: (features ?? []).map((item: string) => item.trim()),
      status: productStatus,
      imageUrl: productImageUrl,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Product created successfully.",
        product: {
          id: product._id.toString(),
          slug: product.slug,
          title: product.title,
          category: product.category,
          price: product.price,
          status: product.status,
          imageUrl: product.imageUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { ok: false, message: "A product with this slug already exists." },
        { status: 409 }
      );
    }

    console.error("Admin product creation failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to create product." },
      { status: 500 }
    );
  }
}
