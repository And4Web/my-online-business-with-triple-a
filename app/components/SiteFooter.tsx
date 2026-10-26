
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-white"
          >
            Nexora<span className="text-blue-400">.</span>
          </Link>

          <p className="mt-2 text-sm text-slate-400">
            Ready-made code. Bigger possibilities.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400"
        >
          <Link href="/projects" className="transition hover:text-blue-400">
            Projects
          </Link>

          <Link href="/#about" className="transition hover:text-blue-400">
            About
          </Link>

          <Link href="/contact" className="transition hover:text-blue-400">
            Contact
          </Link>
        </nav>

        <p className="text-sm text-slate-500">
          © 2026 Nexora. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
