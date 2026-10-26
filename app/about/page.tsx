
import Link from "next/link";

const values = [
  {
    icon: "⚡",
    title: "Save development time",
    description:
      "Start with a ready-made project structure instead of building every part from scratch.",
  },
  {
    icon: "💻",
    title: "Own your code",
    description:
      "Our marketplace is designed around source-code projects you can inspect, learn from, and customize.",
  },
  {
    icon: "🚀",
    title: "Build with confidence",
    description:
      "Explore clear project descriptions and technology details before deciding what fits your needs.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            About Nexora
          </p>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Less time starting.
            <span className="mt-2 block text-blue-400">
              More time building.
            </span>
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
            Nexora is being built as a marketplace for affordable,
            ready-made full-stack source-code projects. Our goal is
            to help developers, learners, and entrepreneurs move from
            an idea to a starting point faster.
          </p>

          <Link
            href="/projects"
            className="mt-8 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
          >
            Explore Projects →
          </Link>
        </section>

        <section className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              What we believe
            </h2>
            <p className="mt-4 text-slate-400">
              Useful code should be accessible and practical.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 transition hover:-translate-y-1 hover:border-blue-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                  {value.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {value.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-500/10 to-slate-900 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold">
            Your next project starts here.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Browse our project catalog and find a starting point
            for your next idea.
          </p>

          <Link
            href="/projects"
            className="mt-7 inline-flex rounded-xl border border-blue-400/50 px-6 py-3 font-semibold text-white transition hover:bg-blue-500/10"
          >
            Browse the Catalog
          </Link>
        </section>
      </div>
    </main>
  );
}
