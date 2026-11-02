
"use client";

import { useEffect, useState } from "react";

type AdminOrder = {
  id: string;
  userId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  amount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
};

type OrdersResponse = {
  ok: boolean;
  count: number;
  orders: AdminOrder[];
  message?: string;
};

const statusStyles: Record<AdminOrder["paymentStatus"], string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  failed: "border-red-500/30 bg-red-500/10 text-red-400",
  refunded: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const response = await fetch("/api/admin/orders", {
          cache: "no-store",
        });

        const data = (await response.json()) as OrdersResponse;

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Unable to load orders.");
        }

        if (isMounted) {
          setOrders(data.orders);
          setTotalOrders(data.count);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong while loading orders."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.paymentStatus === "pending"
  ).length;

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid"
  ).length;

  const failedOrders = orders.filter(
    (order) => order.paymentStatus === "failed"
  ).length;

  const refundedOrders = orders.filter(
    (order) => order.paymentStatus === "refunded"
  ).length;

  const stats = [
    { title: "Total Orders", value: totalOrders },
    { title: "Pending", value: pendingOrders },
    { title: "Paid", value: paidOrders },
    { title: "Failed", value: failedOrders },
    { title: "Refunded", value: refundedOrders },
  ];

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <p className="mt-2 text-sm text-slate-400">
          Monitor customer orders and payment statuses.
        </p>
      </div>

      {loading ? (
        <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
          Loading orders...
        </p>
      ) : error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-900 bg-red-950/30 p-6 text-red-300"
        >
          {error}
        </p>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">{stat.title}</p>
                <p className="mt-3 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-5">
              <h3 className="font-semibold">Recent Customer Orders</h3>
              <p className="mt-1 text-xs text-slate-500">
                Showing the latest {orders.length} orders.
              </p>
            </div>

            {orders.length === 0 ? (
              <p className="p-8 text-center text-slate-400">
                No customer orders have been placed yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-950/70 text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-medium">Order ID</th>
                      <th className="px-5 py-4 font-medium">Customer ID</th>
                      <th className="px-5 py-4 font-medium">Project</th>
                      <th className="px-5 py-4 font-medium">Amount</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Order Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">
                          {order.id.slice(-8)}
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-slate-400">
                          {order.userId.slice(-8)}
                        </td>

                        <td className="px-5 py-4 font-medium text-white">
                          {order.productTitle}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: order.currency,
                          }).format(order.amount)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                              statusStyles[order.paymentStatus]
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

