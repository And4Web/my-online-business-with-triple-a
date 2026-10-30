
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Product from "../../../lib/models/Product";
import { requireAdmin } from "../../../lib/require-admin";

const allowedStatuses = ["draft", "coming-soon", "active"];



export async function GET(request: Request) {
  // 1. Verify administrator access.
  const authError = await requireAdmin(request);

  if (authError) return authError;

  try {
    // 2. Connect to MongoDB.
    await dbConnect();

    // 3. Retrieve every product, including drafts.
    const products = await Product.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    // 4. Return the products.
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
  // 1. Verify administrator access.
  const authError = await requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    // 2. Read the submitted product data.
    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
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
    } = data;

    // 3. Validate required text fields.
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

    // 4. Validate price.
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

    // 5. Validate technologies and features.
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

    // 6. Validate product status.
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

    // 7. Validate optional color.
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

    // 8. Connect to MongoDB.
    await dbConnect();

    // 9. Create the product.
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
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Product created successfully.",
        product: {
          slug: product.slug,
          title: product.title,
          category: product.category,
          price: product.price,
          status: product.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Duplicate product slugs.
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
