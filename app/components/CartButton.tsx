
"use client";

import { useState } from "react";
import Link from "next/link";

interface CartButtonProps {
  slug: string;
}

export default function CartButton({ slug }: CartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

  async function handleAddToCart() {
    setLoading(true);
    setMessage("");
    setNeedsSignIn(false);
    setAddedSuccessfully(false);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setNeedsSignIn(true);
        return;
      }

      if (!response.ok) {
        setMessage(data.message || "Unable to add this product.");
        return;
      }

      setMessage(data.message || "Product added to your cart.");
      setAddedSuccessfully(true);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {message && (
        <p
          role="status"
          className="mt-3 text-sm text-emerald-400"
        >
          {message}
        </p>
      )}

      {addedSuccessfully && (
        <Link
          href="/cart"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
        >
          Go to Cart
          <span aria-hidden="true">→</span>
        </Link>
      )}

      {needsSignIn && (
        <p className="mt-3 text-sm text-slate-300">
          Please{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-emerald-400 underline"
          >
            sign in
          </Link>{" "}
          to add products to your cart.
        </p>
      )}
    </div>
  );
}
