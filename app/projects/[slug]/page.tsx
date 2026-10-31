
import Link from "next/link";
import Image from "next/image";
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
  const imageUrl =
    typeof product.imageUrl === "string" ? product.imageUrl : "";

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">

        {/* Back Navigation */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
        >
          <span>←</span>
          Back to Projects
        </Link>

        {/* Product Preview */}
        <section className="relative mt-8 flex min-h-64 items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-blue-950/60 sm:min-h-96">

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${product.title} preview`}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_65%)]" />

              <div className="relative flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-blue-400/20 bg-slate-950/70 shadow-2xl shadow-blue-950/40 sm:h-28 sm:w-28">
                  <span className="text-5xl font-extrabold text-blue-400 sm:text-6xl">
                    {product.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </>
          )}

          {imageUrl && (
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-slate-950/20" />
          )}

          <div className="absolute bottom-6 left-6 z-10">
            <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 backdrop-blur">
              Nexora Project Preview
            </span>
          </div>
        </section>

        {/* Product Information */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Main Details */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-9">

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                {product.category}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
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

            <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
              {product.description}
            </p>

            {/* Technologies */}
            <section className="mt-10 border-t border-slate-800 pt-8">
              <h2 className="text-xl font-bold">
                Technologies Used
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Built using modern development technologies.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {product.technologies.map((technology: string) => (
                  <span
                    key={technology}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="mt-10 border-t border-slate-800 pt-8">
              <h2 className="text-xl font-bold">
                Project Features
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Explore what is included in this project.
              </p>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.features.map((feature: string) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-400">
                      ✓
                    </span>

                    <span className="text-sm leading-6 text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Pricing Panel */}
          <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 lg:sticky lg:top-8">

            <p className="text-sm font-medium text-slate-400">
              Project Price
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight">
                ${product.price}
              </span>

              <span className="text-sm text-slate-500">
                USD
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              One-time project listing price. Checkout is not enabled yet.
            </p>

            <div className="my-7 border-t border-slate-800" />

            <h2 className="font-bold text-white">
              What to expect
            </h2>

            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                Full-stack project source code
              </li>

              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                Modern development technologies
              </li>

              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                Project features and documentation
              </li>

              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                Secure download after purchase
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="font-semibold text-amber-300">
                {isAvailable
                  ? "Purchasing Coming Soon"
                  : "Project Coming Soon"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {isAvailable
                  ? "This project is marked as available, but payment processing and secure downloads are still being developed."
                  : "We are preparing this project for release. It cannot currently be purchased or downloaded."}
              </p>
            </div>

            <Link
              href="/projects"
              className="mt-6 flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-blue-500/50 hover:bg-slate-800 hover:text-white"
            >
              Explore More Projects
            </Link>
          </aside>
        </div>

        {/* Bottom Note */}
        <p className="mt-10 text-center text-xs leading-6 text-slate-600">
          Nexora — Ready-made projects for developers, entrepreneurs, and businesses.
        </p>
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
          <div className="mx-auto max-w-6xl animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-800" />
            <div className="mt-8 h-72 rounded-3xl border border-slate-800 bg-slate-900/70" />
            <div className="mt-8 h-96 rounded-3xl bg-slate-900/70" />
          </div>
        </main>
      }
    >
      <ProjectDetails slug={slug} />
    </Suspense>
  );
}
