
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Nexora",
  description:
    "Learn about Nexora, a digital software marketplace operated by Divine flame IT Solutions.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Nexora",
    description:
      "Learn about Nexora and Divine flame IT Solutions, the business behind this digital software marketplace.",
    url: "/about",
    siteName: "Nexora",
    type: "website",
  },
};


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Page Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <Link
            href="/"
            className="text-lg font-bold text-blue-400"
          >
            Nexora
          </Link>

          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            About Our Business
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Technology solutions built around practical ideas.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Discover the business behind Nexora, our approach
            to software development, and our commitment to
            making practical digital solutions accessible.
          </p>
        </div>
      </section>

      {/* Business Introduction */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Our Business
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Divine flame IT Solutions
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-slate-400">
            <p>
              Divine flame IT Solutions is an IT venture
              focused on developing and offering software
              solutions and digital products.
            </p>

            <p>
              Through our projects and digital initiatives,
              we aim to make useful technology, practical
              software solutions, and development resources
              accessible to individuals, developers,
              entrepreneurs, and businesses.
            </p>

            <p>
              Nexora is one of the projects operated under
              Divine flame IT Solutions.
            </p>
          </div>
        </div>
      </section>

      {/* About Nexora */}
      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Our Digital Marketplace
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Introducing Nexora
          </h2>

          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-base leading-8 text-slate-400">
                Nexora is a digital marketplace offering
                ready-made software and full-stack web
                development projects. Our catalogue is
                designed to provide practical source-code
                starting points for customers who want to
                learn from existing implementations,
                customize software, or accelerate their
                development work.
              </p>

              <p className="mt-5 text-base leading-8 text-slate-400">
                Our marketplace includes software project
                categories such as e-commerce, communication,
                productivity, booking systems, and other
                web-based applications, subject to product
                availability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7">
              <h3 className="text-xl font-semibold">
                What Nexora offers
              </h3>

              <ul className="mt-6 space-y-5">
                {[
                  {
                    title: "Ready-made software projects",
                    description:
                      "Practical full-stack project starting points.",
                  },
                  {
                    title: "Source-code access",
                    description:
                      "Downloadable project files for eligible purchases.",
                  },
                  {
                    title: "Developer-focused solutions",
                    description:
                      "Projects designed for learning, customization, and further development.",
                  },
                  {
                    title: "Deployment assistance",
                    description:
                      "Optional deployment assistance where offered for a product.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm text-blue-400">
                      ✓
                    </span>

                    <div>
                      <p className="font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/projects"
            className="mt-10 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
          >
            Explore Our Marketplace →
          </Link>
        </div>
      </section>

      {/* Business Identity */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Business Information
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Business ownership and registration
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              Nexora operates as a project of Divine flame
              IT Solutions. The following information
              identifies the business and its ownership.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-6">
              <p className="text-sm text-slate-500">
                Business / Venture Name
              </p>
              <p className="mt-2 text-lg font-semibold">
                Divine flame IT Solutions
              </p>
            </div>

            <div className="border-b border-slate-800 p-6">
              <p className="text-sm text-slate-500">
                Business Project
              </p>
              <p className="mt-2 font-semibold">Nexora</p>
            </div>

            <div className="border-b border-slate-800 p-6">
              <p className="text-sm text-slate-500">
                Owner
              </p>
              <p className="mt-2 font-semibold">XXXX</p>
            </div>

            <div className="border-b border-slate-800 p-6">
              <p className="text-sm text-slate-500">
                UDYAM Registration Number
              </p>
              <p className="mt-2 font-semibold">XXXX</p>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500">
                GST Identification Number (GSTIN)
              </p>
              <p className="mt-2 font-semibold">XXXX</p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Address */}

      {/* Office Address and Contact Information */}
      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Contact Information
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Our Office & Business Contact
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              For business enquiries, customer assistance, and
              other official communications, you can reach
              Divine flame IT Solutions through the contact
              details below.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Office Address */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <span className="text-2xl">📍</span>
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Registered / Business Address
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                XXXX
                <br />
                XXXX
                <br />
                City, State - PIN Code
                <br />
                India
              </p>
            </div>

            {/* Phone and Email */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <span className="text-2xl">☎</span>
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Business Contact
              </h3>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">
                    Phone Number
                  </p>
                  <p className="mt-1 font-medium text-slate-300">
                    XXXX
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Business Email
                  </p>
                  <p className="mt-1 font-medium text-slate-300">
                    XXXX
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Business correspondence should be directed to
            Divine flame IT Solutions.
          </p>
        </div>
      </section>


      {/* Our Approach */}
      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Our Approach
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Built around usefulness and transparency.
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              We believe software products should have
              clear descriptions, transparent pricing,
              and straightforward access to the information
              customers need before placing an order.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              We aim to provide a professional marketplace
              experience through clear product information,
              secure customer accounts, protected digital
              downloads, and transparent business policies.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center sm:p-14">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Have a project in mind?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Explore the Nexora marketplace and discover
            software projects that can help move your
            next idea forward.
          </p>

          <Link
            href="/projects"
            className="mt-8 inline-flex rounded-xl bg-blue-500 px-7 py-3 font-semibold text-white transition hover:bg-blue-400"
          >
            Browse Projects →
          </Link>
        </div>
      </section>
    </main>
  );
}
