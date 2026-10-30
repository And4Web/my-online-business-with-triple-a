
import { connection } from "next/server";
import dbConnect from "../lib/mongodb";
import Product from "../lib/models/Product";
import ProductManagement from "./ProductManagement";

async function loadProducts() {
  try {
    await dbConnect();

    const products = await Product.find({})
      .select(
        "_id title category price status slug description technologies color features"
      )
      .sort({ createdAt: -1 })
      .lean();

    return {
      products: products.map((product) => ({
        id: product._id.toString(),
        slug: product.slug,
        title: product.title,
        category: product.category,
        description: product.description,
        technologies: product.technologies,
        price: product.price,
        color: product.color,
        features: product.features,
        status: product.status,
      })),
      failed: false,
    };
  } catch (error) {
    console.error("Admin dashboard data failed to load:", error);

    return {
      products: [],
      failed: true,
    };
  }
}

export default async function AdminDashboardData() {
  await connection();

  const { products, failed } = await loadProducts();

  if (failed) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-900 bg-red-950/30 p-6 text-red-300"
      >
        Unable to load dashboard data. Please check the database connection
        and try again.
      </p>
    );
  }

  const totalProjects = products.length;

  const activeProjects = products.filter(
    (product) => product.status === "active"
  ).length;

  const comingSoonProjects = products.filter(
    (product) => product.status === "coming-soon"
  ).length;

  const draftProjects = products.filter(
    (product) => product.status === "draft"
  ).length;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      description: "All catalog listings",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Available listings",
    },
    {
      title: "Coming Soon",
      value: comingSoonProjects,
      description: "Upcoming listings",
    },
    {
      title: "Draft Projects",
      value: draftProjects,
      description: "Not yet published",
    },
  ];

  return (
    <>
      <section
        aria-label="Project statistics"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <p className="text-sm text-slate-400">{stat.title}</p>
            <p className="mt-4 text-3xl font-bold">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">
              {stat.description}
            </p>
          </div>
        ))}
      </section>

      <ProductManagement initialProducts={products} />
    </>
  );
}
