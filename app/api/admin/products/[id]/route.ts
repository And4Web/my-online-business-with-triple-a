
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../lib/mongodb";
import Product from "../../../../lib/models/Product";
import { requireAdmin } from "../../../../lib/require-admin";

const allowedStatuses = ["draft", "coming-soon", "active"];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  // 1. Verify administrator access.
  const authError = await requireAdmin(request);

  if (authError) return authError;

  try {
    // 2. Get the product ID from the URL.
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    // 3. Read the submitted product information.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON data." },
        { status: 400 }
      );
    }

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

    // 4. Validate required text fields.
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

    // 5. Validate price.
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

    // 6. Validate technologies.
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

    // 7. Validate features.
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

    // 8. Validate product status.
    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid product status." },
        { status: 400 }
      );
    }

    // 9. Validate product color.
    if (
      typeof color !== "string" ||
      !/^[a-zA-Z0-9-]{1,30}$/.test(color)
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid product color." },
        { status: 400 }
      );
    }

    // 10. Connect to MongoDB.
    await dbConnect();

    // 11. Update the product.
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        slug: slug.trim(),
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        technologies: technologies.map((item: string) => item.trim()),
        price,
        color,
        features: (features ?? []).map((item: string) => item.trim()),
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-__v");

    // 12. Check whether the product exists.
    if (!updatedProduct) {
      return NextResponse.json(
        { ok: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Product updated successfully.",
      product: {
        id: updatedProduct._id.toString(),
        slug: updatedProduct.slug,
        title: updatedProduct.title,
        category: updatedProduct.category,
        price: updatedProduct.price,
        status: updatedProduct.status,
      },
    });
  } catch (error) {
    // 13. Handle duplicate slugs.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "A product with this slug already exists.",
        },
        { status: 409 }
      );
    }

    console.error("Admin product update failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to update product." },
      { status: 500 }
    );
  }
}



export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  // 1. Verify administrator access.
  const authError = await requireAdmin(request);

  if (authError) return authError;

  try {
    // 2. Get the product ID.
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB.
    await dbConnect();

    // 4. Delete the product.
    const deletedProduct = await Product.findByIdAndDelete(id);

    // 5. Check whether the product existed.
    if (!deletedProduct) {
      return NextResponse.json(
        { ok: false, message: "Product not found." },
        { status: 404 }
      );
    }

    // 6. Return success.
    return NextResponse.json({
      ok: true,
      message: "Product deleted successfully.",
      product: {
        id: deletedProduct._id.toString(),
        slug: deletedProduct.slug,
        title: deletedProduct.title,
      },
    });
  } catch (error) {
    console.error("Admin product deletion failed:", error);

    return NextResponse.json(
      { ok: false, message: "Unable to delete product." },
      { status: 500 }
    );
  }
}
