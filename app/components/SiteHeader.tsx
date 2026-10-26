
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap text-3xl font-extrabold tracking-tight text-white"
        >
          Nexora<span className="text-blue-400">.</span>
        </Link>

        <div className="flex items-center gap-3 whitespace-nowrap text-sm text-slate-200 sm:gap-6 sm:text-base">
          <Link
            href="/"
            className="transition hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            href="/projects"
            className="transition hover:text-blue-400"
          >
            Projects
          </Link>

          <Link
            href="/#about"
            className="transition hover:text-blue-400"
          >
            About
          </Link>
        </div>

        <Link
          href="/projects"
          className="shrink-0 whitespace-nowrap rounded-lg border border-blue-500/50 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/20 sm:px-5 sm:py-3 sm:text-base"
        >
          Explore Projects →
        </Link>
      </nav>
    </header>
  );
}
