
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import AdminDashboardData from "./AdminDashboardData";

async function ProtectedAdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
  redirect("/sign-in");
}

if (session.user.role !== "admin") {
  redirect("/");
}

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Nexora Management
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Monitor your marketplace and review your project catalog.
          </p>
        </div>

        <Suspense
          fallback={
            <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              Loading dashboard data...
            </p>
          }
        >
          <AdminDashboardData />
        </Suspense>

        <p className="mt-6 text-sm text-slate-500">
          Administrator-role protection and management-action authorization
          are still being implemented.
        </p>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              Verifying your session...
            </p>
          </div>
        </main>
      }
    >
      <ProtectedAdminDashboard />
    </Suspense>
  );
}
