
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../lib/mongodb";
import Product from "../../../../lib/models/Product";
import { requireAdmin } from "../../../../lib/require-admin";

const allowedStatuses = ["draft", "coming-soon", "active"];

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidImageUrl(value: unknown): boolean {
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

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => typeof item === "string" && item.trim().length > 0
    )
  );
}

function isValidColor(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 100 &&
    /^[a-zA-Z0-9\s-]+$/.test(value.trim())
  );
}

// UPDATE PRODUCT
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    // Check administrator access.
    const authError = await requireAdmin(request);

    if (authError) {
      return authError;
    }

    // Validate product ID.
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    // Read request body.
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid request body.",
        },
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
      slug.trim().length < 2 ||
      slug.trim().length > 100
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please provide a valid product slug.",
        },
        { status: 400 }
      );
    }

    if (
      typeof title !== "string" ||
      title.trim().length < 2 ||
      title.trim().length > 120
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please provide a valid product title.",
        },
        { status: 400 }
      );
    }

    if (
      typeof category !== "string" ||
      category.trim().length < 2 ||
      category.trim().length > 60
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please provide a valid product category.",
        },
        { status: 400 }
      );
    }

    if (
      typeof description !== "string" ||
      description.trim().length < 10 ||
      description.trim().length > 2000
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Description must be between 10 and 2000 characters.",
        },
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
        {
          ok: false,
          message: "Product price must be between $1 and $49.",
        },
        { status: 400 }
      );
    }

    // Validate technologies and features.
    if (!isStringArray(technologies)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please provide valid product technologies.",
        },
        { status: 400 }
      );
    }

    if (!isStringArray(features)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please provide valid product features.",
        },
        { status: 400 }
      );
    }

    // Validate status.
    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please select a valid product status.",
        },
        { status: 400 }
      );
    }

    // Validate color.
    if (!isValidColor(color)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please provide a valid product color.",
        },
        { status: 400 }
      );
    }

    // Validate optional image URL.
    if (!isValidImageUrl(imageUrl ?? "")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please provide a valid HTTPS image URL.",
        },
        { status: 400 }
      );
    }

    // Safely convert image URL to a string.
    const productImageUrl =
      typeof imageUrl === "string" ? imageUrl.trim() : "";

    // Connect to database.
    await dbConnect();

    // Update product.
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        slug: slug.trim(),
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        technologies: technologies.map((item) => item.trim()),
        price,
        color: color.trim(),
        features: features.map((item) => item.trim()),
        status,
        imageUrl: productImageUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-__v");

    if (!updatedProduct) {
      return NextResponse.json(
        {
          ok: false,
          message: "Product not found.",
        },
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
        imageUrl: updatedProduct.imageUrl ?? "",
      },
    });
  } catch (error: unknown) {
    // Handle duplicate slug.
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

    console.error("Update product error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong while updating the product.",
      },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    // Check administrator access.
    const authError = await requireAdmin(request);

    if (authError) {
      return authError;
    }

    // Validate product ID.
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    // Connect to database.
    await dbConnect();

    // Delete product.
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        {
          ok: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

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
    console.error("Delete product error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong while deleting the product.",
      },
      { status: 500 }
    );
  }
}
