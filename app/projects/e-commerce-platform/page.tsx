
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../../lib/projects";

export default function EcommerceProjectPage() {
  const project = projects.find(
    (item) => item.slug === "e-commerce-platform"
  );

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/projects"
          className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
        >
          ← Back to Projects
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-500/20 to-slate-900 sm:min-h-[440px]">
            <div className="text-center">
              <div className="text-8xl">🛍️</div>
              <p className="mt-5 text-sm font-medium text-slate-400">
                Project Preview
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300">
              {project.category}
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {project.title}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              {project.description}
            </p>

            <div className="mt-7">
              <p className="text-sm font-medium text-slate-400">
                Planned technology stack
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-400">
                Planned listing price
              </p>

              <p className="mt-2 text-4xl font-extrabold">
                ${project.price}
              </p>

              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-xl bg-blue-500/50 px-6 py-4 font-bold text-white"
              >
                Purchases Coming Soon
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                Purchasing and downloads are not available yet.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-16 border-t border-slate-800 pt-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Planned project highlights
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            These are intended features for this project. We will
            verify and implement them before the product is offered
            for sale.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <span className="text-blue-400">✓</span>
                <p className="text-sm leading-6 text-slate-300">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
