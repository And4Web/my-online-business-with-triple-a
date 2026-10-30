import Link from "next/link";
import { Suspense } from "react";
import FeaturedProjects from "./components/FeaturedProjects";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-24 text-center sm:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl"
        />

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-300">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          Ready-made projects for developers
        </div>

        <h2 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
          Build faster.
          <span className="block bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Launch smarter.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
          Discover source-code project ideas, learn from practical
          examples, and bring your next big idea to life without
          starting from scratch.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
  href="/projects"
  className="rounded-xl bg-blue-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
>
  Explore Projects →
</Link>

          <a
            href="#about"
            className="rounded-xl border border-slate-700 px-8 py-4 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Learn More
          </a>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Practical code · Clear documentation · Developer-focused
        </p>
      </section>

      {/* Featured Projects: loaded separately from MongoDB */}
      <Suspense
        fallback={
          <section
            id="projects"
            className="mx-auto max-w-6xl px-4 pb-24"
          >
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                The marketplace
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Featured Projects
              </h2>
            </div>

            <p className="text-slate-400" role="status">
              Loading featured projects...
            </p>
          </section>
        }
      >
        <FeaturedProjects />
      </Suspense>

      {/* About Section */}
      <section
        id="about"
        className="mx-auto max-w-6xl px-4 py-20"
      >
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            About Nexora
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Your next idea starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Nexora is being built to help developers and entrepreneurs
            save time with affordable, ready-made source-code projects.
            Our goal is to offer practical starting points that make
            learning and building easier.
          </p>

          <Link
  href="/projects"
  className="mt-8 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
>
  Explore Our Projects →
</Link>
        </div>
      </section>
    </main>
  );
}
