
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../lib/auth";
import SignOutButton from "./SignOutButton";
import OrderHistory from "./OrderHistory";


async function ProtectedAccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <Link
            href="/"
            className="text-xl font-bold text-blue-400"
          >
            Nexora
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Customer Account
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Welcome, {session.user.name || "Customer"}!
          </h1>

          <p className="mt-3 text-slate-400">
            Manage your Nexora account and explore your marketplace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:col-span-2">
            <h2 className="text-xl font-semibold">
              Account Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="mt-1 font-medium">
                  {session.user.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="mt-1 font-medium">
                  {session.user.email}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Quick Links
            </h2>

            <div className="mt-6 space-y-4">
              <Link
                href="/projects"
                className="block text-blue-400 transition hover:text-blue-300"
              >
                Explore Projects →
              </Link>

              <Link
                href="/"
                className="block text-blue-400 transition hover:text-blue-300"
              >
                Visit Homepage →
              </Link>
            </div>
          </section>
        </div>

        <OrderHistory />

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Thank you for being part of Nexora.
          </p>

          <SignOutButton />
        </div>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
          <div className="mx-auto max-w-5xl">
            <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              Verifying your account...
            </p>
          </div>
        </main>
      }
    >
      <ProtectedAccountPage />
    </Suspense>
  );
}
