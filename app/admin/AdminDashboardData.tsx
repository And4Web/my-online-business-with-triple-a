
import { connection } from "next/server";
import dbConnect from "../lib/mongodb";
import Product from "../lib/models/Product";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  "coming-soon": "bg-blue-500/10 text-blue-400",
  draft: "bg-slate-700 text-slate-300",
};

async function loadProducts() {
  try {
    await dbConnect();

    const products = await Product.find({})
      .select("title category price status slug")
      .sort({ createdAt: -1 })
      .lean();

    return {
      products,
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

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Product Catalog</h2>
          <p className="mt-1 text-sm text-slate-400">
            Products retrieved directly from MongoDB.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-4 font-medium">Project</th>
                <th className="px-4 py-4 font-medium">Category</th>
                <th className="px-4 py-4 font-medium">Price</th>
                <th className="px-4 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.slug}
                  className="border-b border-slate-800 last:border-0"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {product.title}
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {product.category}
                  </td>

                  <td className="px-4 py-4 text-slate-300">
                    ${product.price.toFixed(2)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyles[product.status] ??
                        "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No products found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
