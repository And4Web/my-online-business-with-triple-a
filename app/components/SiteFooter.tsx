
import Link from "next/link";

export default function SiteFooter() {
  

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand and business identity */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block text-3xl font-extrabold tracking-tight text-white transition hover:text-blue-100"
            >
              Nexora<span className="text-blue-400">.</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Ready-made full-stack software projects designed
              to help developers, entrepreneurs, and businesses
              build and launch faster.
            </p>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Operated by
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-200">
                Divine flame IT Solutions
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                An IT venture providing digital products and
                software solutions.
              </p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Explore
            </h2>

            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-blue-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/projects"
                  className="transition hover:text-blue-400"
                >
                  All Projects
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-blue-400"
                >
                  About Nexora
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-blue-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer support */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Customer Support
            </h2>

            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-blue-400"
                >
                  Get in Touch
                </Link>
              </li>

              <li>
                <Link
                  href="/account"
                  className="transition hover:text-blue-400"
                >
                  My Account
                </Link>
              </li>

              <li>
                <Link
                  href="/account"
                  className="transition hover:text-blue-400"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-blue-400"
                >
                  Download Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Legal & Policies
            </h2>

            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-blue-400"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/refund"
                  className="transition hover:text-blue-400"
                >
                  Refund & Cancellation
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-blue-400"
                >
                  Business Information
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom footer bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">

          <p className="text-xs leading-6 text-slate-500">
            © 2026 Nexora. All rights reserved.
          </p>

          <p className="text-xs leading-6 text-slate-500">
            A digital marketplace operated by{" "}
            <span className="font-medium text-slate-300">
              Divine flame IT Solutions
            </span>
            .
          </p>

        </div>
      </div>

    </footer>
  );
}
