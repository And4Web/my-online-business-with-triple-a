
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

type Invoice = {
  id: string;
  orderId: string;
  invoiceNumber: string;
};

const statusStyles: Record<Order["paymentStatus"], string> = {
  pending: "bg-amber-500/10 text-amber-400",
  paid: "bg-emerald-500/10 text-emerald-400",
  failed: "bg-red-500/10 text-red-400",
  refunded: "bg-slate-500/10 text-slate-300",
};

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Record<string, Invoice>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [downloadError, setDownloadError] = useState("");
  const [invoiceDownloadError, setInvoiceDownloadError] = useState("");

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchAccountData() {
      try {
        // Load the customer's orders.
        const ordersResponse = await fetch("/api/orders", {
          cache: "no-store",
        });

        const ordersData = await ordersResponse.json();

        if (!ordersResponse.ok) {
          throw new Error(
            ordersData.message || "Unable to load your orders."
          );
        }

        setOrders(ordersData.orders || []);

        // Load the customer's ready invoices separately.
        try {
          const invoicesResponse = await fetch("/api/invoices", {
            cache: "no-store",
          });

          const invoicesData = await invoicesResponse.json();

          if (invoicesResponse.ok && invoicesData.ok) {
            const invoiceMap: Record<string, Invoice> = {};

            for (const invoice of invoicesData.invoices || []) {
              invoiceMap[invoice.orderId] = invoice;
            }

            setInvoices(invoiceMap);
          }
        } catch {
          // Invoice loading should not prevent order history from appearing.
        }
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

    fetchAccountData();
  }, []);

  async function handleDownload(orderId: string) {
    try {
      setDownloadError("");
      setDownloadingId(orderId);

      const response = await fetch(`/api/orders/${orderId}/download`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to prepare your download.");
      }

      if (!data.downloadUrl) {
        throw new Error("The download link was not received.");
      }

      window.location.assign(data.downloadUrl);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Something went wrong while downloading."
      );
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleInvoiceDownload(invoiceId: string) {
    try {
      setInvoiceDownloadError("");
      setDownloadingInvoiceId(invoiceId);

      const response = await fetch(
        `/api/invoices/${invoiceId}/download`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to prepare your invoice."
        );
      }

      if (!data.downloadUrl) {
        throw new Error("The invoice download link was not received.");
      }

      window.location.assign(data.downloadUrl);
    } catch (error) {
      setInvoiceDownloadError(
        error instanceof Error
          ? error.message
          : "Something went wrong while downloading your invoice."
      );
    } finally {
      setDownloadingInvoiceId(null);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">My Orders</h2>

      <p className="mt-2 text-sm text-slate-400">
        Track your Nexora orders, payment status, invoices, and available
        downloads.
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

      {downloadError && (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {downloadError}
        </p>
      )}

      {invoiceDownloadError && (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {invoiceDownloadError}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="font-medium text-white">No orders yet</p>

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
          {orders.map((order) => {
            const invoice = invoices[order.id];

            return (
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
                    {formatAmount(order.amount, order.currency)}
                  </p>

                  {invoice && (
                    <p className="mt-2 text-xs text-slate-400">
                      Invoice: {invoice.invoiceNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.paymentStatus]}`}
                  >
                    {order.paymentStatus}
                  </span>

                  {order.paymentStatus === "paid" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDownload(order.id)}
                        disabled={
                          downloadingId !== null ||
                          downloadingInvoiceId !== null
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingId === order.id
                          ? "Preparing download..."
                          : "Download ZIP"}
                      </button>

                      {invoice && (
                        <button
                          type="button"
                          onClick={() =>
                            handleInvoiceDownload(invoice.id)
                          }
                          disabled={
                            downloadingInvoiceId !== null ||
                            downloadingId !== null
                          }
                          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {downloadingInvoiceId === invoice.id
                            ? "Preparing invoice..."
                            : "Download Invoice PDF"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
