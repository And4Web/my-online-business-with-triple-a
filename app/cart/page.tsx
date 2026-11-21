
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CartProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  imageUrl: string;
  status: string;
  isAvailable: boolean;
}

interface CartItem {
  productId: string;
  addedAt: string;
  product: CartProduct | null;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const response = await fetch("/api/cart", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please sign in to view your cart.");
          }

          throw new Error(data.message || "Unable to load your cart.");
        }

        if (!cancelled) {
          setItems(data.items || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your cart."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRemove(productId: string) {
    setRemovingId(productId);
    setError("");

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove this product.");
      }

      setItems(data.items || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove this product."
      );
    } finally {
      setRemovingId(null);
    }
  }

  const availableItems = items.filter(
    (item) => item.product?.isAvailable
  );

  const subtotal = availableItems.reduce(
    (total, item) => total + (item.product?.price ?? 0),
    0
  );

  const unavailableCount = items.length - availableItems.length;

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-6 py-20">
        <p className="text-center text-slate-400">Loading your cart...</p>
      </main>
    );
  }

  return (
    <div className="w-full min-h-[70vh] bg-slate-950">
    <main className="mx-auto min-h-[70vh] max-w-6xl px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Your Shopping Cart
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Review Your Projects
        </h1>

        <p className="mt-3 text-slate-400">
          Review your selected projects before proceeding to checkout.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
          {error.includes("sign in") && (
            <>
              {" "}
              <Link
                href="/sign-in"
                className="font-semibold underline"
              >
                Sign in here
              </Link>
              .
            </>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Your cart is empty
          </h2>

          <p className="mt-3 text-slate-400">
            Explore our projects and add something you would like to purchase.
          </p>

          <Link
            href="/projects"
            className="mt-7 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Cart Items
              </h2>

              <span className="text-sm text-slate-400">
                {items.length} {items.length === 1 ? "project" : "projects"}
              </span>
            </div>

            {items.map((item) => {
              const product = item.product;
              const unavailable =
                !product || !product.isAvailable;

              return (
                <article
                  key={item.productId}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:w-36">
                    {product?.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 144px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {product ? (
                      <>
                        <Link
                          href={`/projects/${product.slug}`}
                          className="font-semibold text-white transition hover:text-emerald-400"
                        >
                          {product.title}
                        </Link>

                        <p className="mt-1 text-sm text-slate-400">
                          {product.category}
                        </p>

                        <p className="mt-3 font-semibold text-emerald-400">
                          {formatPrice(product.price)}
                        </p>
                      </>
                    ) : (
                      <p className="font-semibold text-white">
                        Product no longer available
                      </p>
                    )}

                    {unavailable && (
                      <p className="mt-2 text-sm text-amber-400">
                        This project is currently unavailable for purchase.
                        Please remove it from your cart.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    disabled={removingId === item.productId}
                    className="shrink-0 self-start rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50 sm:self-center"
                  >
                    {removingId === item.productId
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </article>
              );
            })}

            <Link
              href="/projects"
              className="inline-flex pt-3 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              ← Continue browsing projects
            </Link>
          </section>

          <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold text-white">
              Order Summary
            </h2>

            <div className="mt-6 flex justify-between text-sm text-slate-400">
              <span>Available projects</span>
              <span>{availableItems.length}</span>
            </div>

            <div className="mt-4 flex justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {unavailableCount > 0 && (
              <p className="mt-4 text-sm text-amber-400">
                {unavailableCount} unavailable{" "}
                {unavailableCount === 1 ? "item is" : "items are"} excluded
                from your subtotal.
              </p>
            )}

            <div className="my-6 border-t border-white/10" />

            <div className="flex justify-between gap-4 text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-emerald-400">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Final pricing and product availability will be verified again
              by our server during checkout.
            </p>

            <Link
              href="/checkout"
              aria-disabled={availableItems.length === 0}
              className={`mt-7 flex w-full items-center justify-center rounded-xl px-5 py-3 text-center font-semibold transition ${
                availableItems.length === 0
                  ? "pointer-events-none bg-slate-700 text-slate-400"
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              }`}
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
    </div>
  );
}
