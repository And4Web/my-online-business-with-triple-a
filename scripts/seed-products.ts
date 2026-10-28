
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

async function seedProducts() {
  try {
    // Load .env.local before importing the database module.
    loadEnvConfig(process.cwd());

    const { default: dbConnect } = await import("../app/lib/mongodb");
    const { default: Product } = await import(
      "../app/lib/models/Product"
    );

    await dbConnect();

    const sampleProducts = [
      {
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
      },
      {
        slug: "real-time-chat-app",
        title: "Real-Time Chat App",
        category: "Communication",
        description:
          "A planned messaging project for exploring real-time communication features.",
        technologies: ["React", "Socket.IO", "Node.js"],
        price: 29,
        color: "purple",
        features: [
          "Chat interface design",
          "Planned real-time messaging",
          "Responsive layout",
        ],
        status: "coming-soon" as const,
      },
      {
        slug: "admin-dashboard",
        title: "Admin Dashboard",
        category: "Productivity",
        description:
          "A planned dashboard project for organizing information and presenting useful metrics.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
        price: 19,
        color: "cyan",
        features: [
          "Dashboard layout",
          "Data visualization area",
          "Responsive admin interface",
        ],
        status: "coming-soon" as const,
      },
    ];

    for (const product of sampleProducts) {
      await Product.updateOne(
        { slug: product.slug },
        { $set: product },
        { upsert: true, runValidators: true }
      );

      console.log(`Saved product: ${product.title}`);
    }

    const savedProducts = await Product.find({
      slug: {
        $in: sampleProducts.map((product) => product.slug),
      },
    })
      .select("slug title price status")
      .sort({ price: 1 })
      .lean();

    console.log("\nVerified products in MongoDB:");
    console.log(JSON.stringify(savedProducts, null, 2));
    console.log(`\nTotal sample products: ${savedProducts.length}`);
  } catch (error) {
    console.error("Product seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
