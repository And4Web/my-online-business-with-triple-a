
import Link from "next/link";

const features = [
  "Product listing and product details",
  "Shopping cart foundation",
  "Responsive storefront layout",
  "MongoDB integration preparation",
  "TypeScript-based project structure",
  "Checkout flow preparation",
];

export default function EcommerceProductPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/projects"
          className="text-sm text-slate-400 transition hover:text-blue-400"
        >
          ← Back to Projects
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-500/20 via-slate-900 to-purple-500/20">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-blue-400/30 bg-slate-950/70 text-5xl shadow-2xl shadow-blue-500/10">
                  🛍️
                </div>
                <p className="mt-5 text-sm font-medium text-slate-400">
                  Nexora Starter Project
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-lg font-bold">Technologies</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"].map(
                  (technology) => (
                    <span
                      key={technology}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300"
                    >
                      {technology}
                    </span>
                  ),
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                This is our planned technology stack for the starter.
                We will implement and verify its actual features before
                offering it for sale.
              </p>
            </div>
          </div>

          <div>
            <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400">
              E-commerce
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              E-commerce Platform
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Start building your online store with a structured
              storefront foundation designed to save development time.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-sm text-slate-400">Planned launch price</p>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold">$39</span>
                <span className="text-sm text-slate-500">USD</span>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl bg-blue-500/50 px-6 py-4 font-bold text-white"
              >
                Purchases Coming Soon
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                Checkout will be enabled after the product and payment
                system are ready.
              </p>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold">What&apos;s planned?</h2>

              <ul className="mt-5 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm text-blue-400">
                      ✓
                    </span>
                    <span className="text-sm leading-6 text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-slate-800 pt-6">
              <p className="text-sm leading-6 text-slate-400">
                Need help getting your project online? Optional
                deployment assistance is part of our planned service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
