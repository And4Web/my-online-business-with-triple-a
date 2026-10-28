import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import dbConnect from "../../lib/mongodb";
import Product from "../../lib/models/Product";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function ProjectDetails({ slug }: { slug: string }) {
  await connection();

  let product;

  try {
    await dbConnect();

    product = await Product.findOne({
      slug,
      status: { $in: ["active", "coming-soon"] },
    })
      .select("-__v")
      .lean();
  } catch (error) {
    console.error("Failed to load project details:", error);
    throw new Error("Unable to load project details.");
  }

  if (!product) {
    notFound();
  }

  const isAvailable = product.status === "active";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
  href="/projects"
  className="inline-flex text-sm font-medium text-blue-400 transition hover:text-blue-300"
>
  ← Back to Projects
</Link>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {product.category}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                isAvailable
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {isAvailable ? "Available" : "Coming Soon"}
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            {product.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            {product.description}
          </p>

          <div className="mt-8 border-y border-slate-800 py-6">
            <p className="text-sm text-slate-400">
              Planned listing price
            </p>
            <p className="mt-2 text-4xl font-bold">
              ${product.price}
              <span className="ml-2 text-base font-normal text-slate-400">
                USD
              </span>
            </p>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Technologies</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.technologies.map((technology: string) => (
                <span
                  key={technology}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Project Features</h2>
            <ul className="mt-4 space-y-3">
              {product.features.map((feature: string) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <span className="text-blue-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h2 className="font-semibold text-amber-300">
              {isAvailable
                ? "Purchasing is not enabled yet"
                : "This project is coming soon"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isAvailable
                ? "This listing is marked active, but checkout and secure downloads have not been implemented yet."
                : "We are preparing this project for a future release. It is not currently available to purchase or download."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-4xl animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-800" />
            <div className="mt-8 h-64 rounded-3xl border border-slate-800 bg-slate-900/70" />
          </div>
        </main>
      }
    >
      <ProjectDetails slug={slug} />
    </Suspense>
  );
}
