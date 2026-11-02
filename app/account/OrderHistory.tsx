
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  productTitle: string;
  productSlug: string;
  amount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
};

const statusStyles: Record<Order["paymentStatus"], string> = {
  pending: "bg-amber-500/10 text-amber-400",
  paid: "bg-emerald-500/10 text-emerald-400",
  failed: "bg-red-500/10 text-red-400",
  refunded: "bg-slate-500/10 text-slate-300",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your orders.");
        }

        setOrders(data.orders || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">My Purchases</h2>

      <p className="mt-2 text-sm text-slate-400">
        View your Nexora orders and their payment status.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-slate-400">
          Loading your orders...
        </p>
      )}

      {error && (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="font-medium text-white">No purchases yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Your orders will appear here after you place your first order.
          </p>
          <Link
            href="/projects"
            className="mt-4 inline-block text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Explore Projects →
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-5 sm:flex-row sm:items-center"
            >
              <div>
                <Link
                  href={`/projects/${order.productSlug}`}
                  className="font-semibold text-white transition hover:text-blue-400"
                >
                  {order.productTitle}
                </Link>

                <p className="mt-2 text-sm text-slate-500">
                  Order date:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-300">
                  ${order.amount.toFixed(2)} {order.currency}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.paymentStatus]}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
