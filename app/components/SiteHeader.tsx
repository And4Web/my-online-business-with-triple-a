
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "../lib/auth-client";

export default function SiteHeader() {
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user.role === "admin";

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 shadow-lg shadow-black/10 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex shrink-0 flex-col"
        >
          <span className="text-3xl font-extrabold tracking-tight text-white transition group-hover:text-blue-100">
            Nexora<span className="text-blue-400">.</span>
          </span>

          <span className="hidden text-[10px] font-medium tracking-[0.2em] text-slate-500 sm:block">
            READY-MADE SOFTWARE PROJECTS
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 text-sm font-medium text-slate-300 lg:flex">
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
            href="/about"
            className="transition hover:text-blue-400"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-blue-400"
          >
            Contact
          </Link>
        </div>

        {/* Desktop account actions */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          {!isPending && (
            session ? (
              <>
                <Link
                  href="/account"
                  className="text-sm font-semibold text-slate-200 transition hover:text-blue-400"
                >
                  My Account
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/20"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-slate-200 transition hover:text-blue-400"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
                >
                  Register
                </Link>
              </>
            )
          )}

          <Link
            href="/projects"
            className="rounded-lg bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-400 hover:shadow-blue-500/20"
          >
            Explore Projects
            <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition hover:border-blue-500 hover:text-blue-400 lg:hidden"
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-800 bg-slate-950 px-4 py-5 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-blue-400"
            >
              Home
            </Link>

            <Link
              href="/projects"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-blue-400"
            >
              Projects
            </Link>

            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-blue-400"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-blue-400"
            >
              Contact
            </Link>

            {!isPending && (
              <>
                <div className="my-2 border-t border-slate-800" />

                {session ? (
                  <>
                    <Link
                      href="/account"
                      onClick={closeMobileMenu}
                      className="rounded-lg px-4 py-3 text-sm font-semibold text-blue-400 transition hover:bg-slate-900"
                    >
                      My Account
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={closeMobileMenu}
                        className="rounded-lg px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-slate-900"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={closeMobileMenu}
                      className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900 hover:text-blue-400"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900 hover:text-blue-400"
                    >
                      Register
                    </Link>
                  </>
                )}
              </>
            )}

            <Link
              href="/projects"
              onClick={closeMobileMenu}
              className="mt-3 rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-400"
            >
              Explore Projects →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
