
"use client";

import { useState } from "react";
import Link from "next/link";

type PurchaseButtonProps = {
  slug: string;
};

export default function PurchaseButton({ slug }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");



  async function handlePurchase() {
    setLoading(true);
    setError("");
    setNeedsSignIn(false);

    const requestKey = idempotencyKey || crypto.randomUUID();

if (!idempotencyKey) {
  setIdempotencyKey(requestKey);
}

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  slug,
  idempotencyKey: requestKey,
}),
      });

      const data = await response.json();

      if (response.status === 401) {
        setNeedsSignIn(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to create your order.");
      }

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-emerald-400">
          Your pending order was created successfully!
        </p>
        <p className="text-sm text-slate-400">
          Payment is not enabled yet. Your order is not marked as paid.
        </p>
        <Link
          href="/account"
          className="inline-block text-sm font-semibold text-blue-400 transition hover:text-blue-300"
        >
          View My Orders →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handlePurchase}
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating Order..." : "Place Order"}
      </button>

      {needsSignIn && (
        <p className="text-sm text-amber-400">
          Please{" "}
          <Link
            href="/sign-in"
            className="font-semibold underline hover:text-amber-300"
          >
            sign in
          </Link>{" "}
          before placing an order.
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <p className="text-xs text-slate-500">
        Payment is not enabled yet. This action only creates a pending order.
      </p>
    </div>
  );
}
