"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type AdminOrder = {
  id: string;
  userId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

type OrdersResponse = {
  ok: boolean;
  message?: string;
  orders?: AdminOrder[];
  count?: number;
  statusCounts?: {
    pending: number;
    paid: number;
    failed: number;
    refunded: number;
  };
};

const statusStyles: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    paid: 0,
    failed: 0,
    refunded: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Fetch orders without changing React state.
  const fetchOrders = useCallback(async (): Promise<OrdersResponse> => {
    const response = await fetch("/api/admin/orders", {
      cache: "no-store",
    });

    const data = (await response.json()) as OrdersResponse;

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Unable to load orders.");
    }

    return data;
  }, []);

  // Initial page load.
  useEffect(() => {
    let cancelled = false;

    fetchOrders()
      .then((data) => {
        if (cancelled) return;

        setOrders(data.orders || []);
        setTotalOrders(data.count || 0);
        setStatusCounts(
          data.statusCounts || {
            pending: 0,
            paid: 0,
            failed: 0,
            refunded: 0,
          },
        );
        setError("");
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading orders.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchOrders]);

  // Refresh button handler.
  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");

    try {
      const data = await fetchOrders();

      setOrders(data.orders || []);
      setTotalOrders(data.count || 0);
      setStatusCounts(
        data.statusCounts || {
          pending: 0,
          paid: 0,
          failed: 0,
          refunded: 0,
        },
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while refreshing orders.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const pendingOrders = statusCounts.pending;
  const paidOrders = statusCounts.paid;
  const failedOrders = statusCounts.failed;
  const refundedOrders = statusCounts.refunded;

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter((order) => order.paymentStatus === statusFilter);
    }

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((order) => {
        return (
          order.id.toLowerCase().includes(query) ||
          order.userId.toLowerCase().includes(query) ||
          order.productTitle.toLowerCase().includes(query) ||
          order.productSlug.toLowerCase().includes(query)
        );
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortOrder]);

  const formatAmount = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(amount);
    } catch {
      return `${currency || "USD"} ${amount.toFixed(2)}`;
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleString();
  };

  const statistics = [
    {
      label: "Total Orders",
      value: totalOrders,
      description: "All orders",
      style: "text-white",
    },
    {
      label: "Pending",
      value: pendingOrders,
      description: "In loaded orders",
      style: "text-yellow-600",
    },
    {
      label: "Paid",
      value: paidOrders,
      description: "In loaded orders",
      style: "text-green-600",
    },
    {
      label: "Failed",
      value: failedOrders,
      description: "In loaded orders",
      style: "text-red-600",
    },
    {
      label: "Refunded",
      value: refundedOrders,
      description: "In loaded orders",
      style: "text-gray-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Order Management</h2>
          <p className="mt-1 text-sm text-gray-400">
            Review customer orders and monitor payment statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-400">{error}</p>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-sm font-medium text-red-300 underline hover:text-red-200"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statistics.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-800 bg-gray-900 p-5"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>

            <p className={`mt-2 text-3xl font-bold ${stat.style}`}>
              {loading ? "..." : stat.value.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search order ID, customer ID or project..."
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="mb-4 flex flex-col gap-2 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredOrders.length} of {orders.length} loaded orders
          </p>

          <p>Total orders: {totalOrders}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-4 font-medium">Order ID</th>
                <th className="px-4 py-4 font-medium">Customer ID</th>
                <th className="px-4 py-4 font-medium">Project</th>
                <th className="px-4 py-4 font-medium">Amount</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    {orders.length === 0
                      ? "No orders found."
                      : "No orders match your search or filter."}

                    {orders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="ml-2 text-blue-400 hover:text-blue-300"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-gray-800/50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-gray-300">
                      ...{order.id.slice(-8)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-mono text-gray-400">
                      ...{order.userId.slice(-8)}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-white">
                        {order.productTitle}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {order.productSlug}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-300">
                      {formatAmount(order.amount, order.currency)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[order.paymentStatus]}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
