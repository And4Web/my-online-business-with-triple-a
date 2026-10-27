
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

async function seedProducts() {
  try {
    // Load .env.local before importing our database module.
    loadEnvConfig(process.cwd());

    // Import these only after environment variables are loaded.
    const { default: dbConnect } = await import("../app/lib/mongodb");
    const { default: Product } = await import(
      "../app/lib/models/Product"
    );

    await dbConnect();

    const sampleProduct = {
      slug: "e-commerce-platform",
      title: "E-commerce Platform",
      category: "E-commerce",
      description:
        "A planned online store project for businesses looking to build an e-commerce website.",
      technologies: ["Next.js", "MongoDB", "TypeScript"],
      price: 39,
      color: "blue",
      features: [
        "Product catalog layout",
        "Responsive storefront design",
        "Planned database integration",
      ],
      status: "coming-soon" as const,
    };

    await Product.updateOne(
      { slug: sampleProduct.slug },
      { $set: sampleProduct },
      { upsert: true, runValidators: true }
    );

    const savedProduct = await Product.findOne({
      slug: sampleProduct.slug,
    }).lean();

    console.log("Product saved and verified:");
    console.log(JSON.stringify(savedProduct, null, 2));
  } catch (error) {
    console.error("Product seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
