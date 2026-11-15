
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type AdminInvoice = {
  id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  customer: {
    name: string;
    email: string;
  };
  product: {
    title: string;
    slug: string;
  };
  payment: {
    amount: number;
    currency: string;
    paidAt: string;
  };
  tax: {
    applicable: boolean;
    taxAmount?: number;
    totalAmount: number;
  };
  status: "generating" | "ready" | "failed";
  fileName: string;
  createdAt: string;
};

type InvoicesResponse = {
  ok: boolean;
  message?: string;
  count: number;
  statusCounts: {
    ready: number;
    generating: number;
    failed: number;
  };
  invoices: AdminInvoice[];
};

type InvoiceFilter = "all" | "ready" | "generating" | "failed";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function getStatusStyle(status: AdminInvoice["status"]) {
  switch (status) {
    case "ready":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "generating":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "failed":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [count, setCount] = useState(0);

  const [statusCounts, setStatusCounts] = useState({
    ready: 0,
    generating: 0,
    failed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceFilter>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/invoices", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as InvoicesResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to load invoices.");
      }

      setInvoices(data.invoices);
      setCount(data.count);
      setStatusCounts(data.statusCounts);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading invoices."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initialFetch = Promise.resolve().then(() => {
      if (!cancelled) {
        void fetchInvoices();
      }
    });

    return () => {
      cancelled = true;
      void initialFetch;
    };
  }, [fetchInvoices]);

  function handleRefresh() {
    setRefreshing(true);
    setError("");
    void fetchInvoices();
  }

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...invoices]
      .filter((invoice) => {
        const matchesStatus =
          statusFilter === "all" || invoice.status === statusFilter;

        const searchableText = [
          invoice.invoiceNumber,
          invoice.orderId,
          invoice.userId,
          invoice.customer.name,
          invoice.customer.email,
          invoice.product.title,
          invoice.product.slug,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          query.length === 0 || searchableText.includes(query);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sortOrder === "newest"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [invoices, searchQuery, statusFilter, sortOrder]);

  async function handleDownload(invoiceId: string) {
    setDownloadingId(invoiceId);
    setError("");

    try {
      const response = await fetch(
        `/api/invoices/${invoiceId}/download`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok || !data.downloadUrl) {
        throw new Error(data.message || "Unable to download this invoice.");
      }

      window.location.assign(data.downloadUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while downloading the invoice."
      );
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <section
      aria-label="Invoice management"
      className="mt-10 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Invoice Management
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Review customer invoices and download generated PDF copies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh invoices"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-sm text-slate-400">Total invoices</p>
          <p className="mt-2 text-2xl font-semibold text-white">{count}</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-sm text-emerald-300">Ready</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {statusCounts.ready}
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm text-amber-300">Generating</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {statusCounts.generating}
          </p>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-300">Failed</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {statusCounts.failed}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search invoice, customer, product or order..."
          className="min-w-0 rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 md:col-span-2"
        />

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as InvoiceFilter)
            }
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            aria-label="Filter invoices by status"
          >
            <option value="all">All statuses</option>
            <option value="ready">Ready</option>
            <option value="generating">Generating</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as "newest" | "oldest")
            }
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            aria-label="Sort invoices"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-slate-400">
          Loading invoices...
        </p>
      ) : filteredInvoices.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-slate-300">
            {invoices.length === 0
              ? "No invoices have been generated yet."
              : "No invoices match your search."}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Invoices will appear here after successful payment and PDF
            generation.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-262.5 text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 font-medium">Invoice</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Product</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Created</th>
                <th className="px-3 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="text-slate-300">
                  <td className="px-3 py-4 align-top">
                    <p className="font-medium text-white">
                      {invoice.invoiceNumber}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Order: {invoice.orderId.slice(-8)}
                    </p>
                  </td>

                  <td className="max-w-55 px-3 py-4 align-top">
                    <p className="truncate font-medium text-slate-200">
                      {invoice.customer.name}
                    </p>

                    <p className="mt-1 break-all text-xs text-slate-500">
                      {invoice.customer.email}
                    </p>
                  </td>

                  <td className="max-w-50 px-3 py-4 align-top">
                    <p className="font-medium text-slate-200">
                      {invoice.product.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {invoice.product.slug}
                    </p>
                  </td>

                  <td className="px-3 py-4 align-top whitespace-nowrap">
                    <p className="font-medium text-white">
                      {formatMoney(
                        invoice.payment.amount,
                        invoice.payment.currency
                      )}
                    </p>

                    {invoice.tax.applicable && (
                      <p className="mt-1 text-xs text-slate-500">
                        Total:{" "}
                        {formatMoney(
                          invoice.tax.totalAmount,
                          invoice.payment.currency
                        )}
                      </p>
                    )}
                  </td>

                  <td className="px-3 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyle(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </td>

                  <td className="px-3 py-4 align-top whitespace-nowrap text-slate-400">
                    {formatDate(invoice.createdAt)}
                  </td>

                  <td className="px-3 py-4 text-right align-top">
                    {invoice.status === "ready" ? (
                      <button
                        type="button"
                        onClick={() => void handleDownload(invoice.id)}
                        disabled={downloadingId === invoice.id}
                        className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingId === invoice.id
                          ? "Preparing..."
                          : "Download PDF"}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Not available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && invoices.length > 0 && (
        <p className="mt-4 text-xs text-slate-500">
          Showing {filteredInvoices.length} of {invoices.length} invoices
          returned by the latest-100 API limit.
        </p>
      )}
    </section>
  );
}
