
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

interface CartProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  isAvailable: boolean;
}

interface CartItem {
  productId: string;
  product: CartProduct | null;
}

interface CheckoutOrder {
  id: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  createdAt: string;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [completedOrder, setCompletedOrder] =
    useState<CheckoutOrder | null>(null);

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
            setNeedsSignIn(true);
            return;
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

  const availableItems = items.filter(
    (item) => item.product?.isAvailable
  );

  const unavailableCount = items.length - availableItems.length;

  const subtotal = availableItems.reduce(
    (total, item) => total + (item.product?.price ?? 0),
    0
  );

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    const requestKey = idempotencyKey || crypto.randomUUID();

    // Keep the same key if the customer needs to retry.
    setIdempotencyKey(requestKey);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          address,
          country,
          idempotencyKey: requestKey,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setNeedsSignIn(true);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to complete checkout."
        );
      }

      setCompletedOrder(data.order);
      setItems([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-950 px-6 py-20 text-center text-slate-400">
        Loading checkout...
      </main>
    );
  }

  if (needsSignIn) {
    return (
      <main className="min-h-[70vh] bg-slate-950 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-white">
          Sign in required
        </h1>

        <p className="mt-4 text-slate-400">
          Please sign in to continue with checkout.
        </p>

        <Link
          href="/sign-in"
          className="mt-7 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Sign In
        </Link>
      </main>
    );
  }

  if (completedOrder) {
    return (
      <main className="min-h-[70vh] bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-500/30 bg-slate-900 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-400">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            Order Created Successfully!
          </h1>

          <p className="mt-3 text-slate-400">
            Your order has been created and is currently pending payment.
          </p>

          <div className="mt-8 rounded-xl border border-white/10 bg-slate-950 p-5 text-left">
            <div className="flex justify-between gap-4 text-sm text-slate-400">
              <span>Order ID</span>
              <span className="break-all text-right text-white">
                {completedOrder.id}
              </span>
            </div>

            <div className="mt-4 flex justify-between text-sm text-slate-400">
              <span>Order Total</span>
              <span className="font-semibold text-emerald-400">
                {formatPrice(completedOrder.amount)}
              </span>
            </div>

            <div className="mt-4 flex justify-between text-sm text-slate-400">
              <span>Payment Status</span>
              <span className="font-semibold text-amber-400">
                Pending
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            Payment processing is not enabled yet. You can view your order
            from your customer account.
          </p>

          <Link
            href="/account"
            className="mt-7 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-slate-950 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-white">
          Your cart is empty
        </h1>

        <p className="mt-4 text-slate-400">
          Add some projects before proceeding to checkout.
        </p>

        <Link
          href="/projects"
          className="mt-7 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Browse Projects
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-slate-950 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Secure Checkout
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-3 text-slate-400">
            Enter your details to create your order.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {unavailableCount > 0 && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
            Some products are unavailable. Please return to your cart and
            remove them before checkout.
            {" "}
            <Link href="/cart" className="font-semibold underline">
              Review cart
            </Link>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">
              Customer Information
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Please provide your billing and destination details.
            </p>

            <form onSubmit={handleCheckout} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={150}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Complete Address
                </label>

                <textarea
                  id="address"
                  required
                  maxLength={1000}
                  rows={5}
                  autoComplete="street-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="House / Building, Street, City, State / Province, Postal Code"
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Country of Destination
                </label>

                <input
                  id="country"
                  type="text"
                  autoComplete="country-name"
                  required
                  maxLength={100}
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="Enter your country"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                <p className="text-sm leading-6 text-slate-400">
                  Your information will be used to process your order and
                  prepare your purchase documentation.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || availableItems.length === 0}
                className="w-full rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating Your Order..." : "Place Order"}
              </button>

              <p className="text-center text-xs leading-5 text-slate-500">
                This step creates a pending order. Payment processing is
                not enabled yet.
              </p>
            </form>
          </section>

          <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold text-white">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-white">
                      {item.product?.title || "Unavailable product"}
                    </p>

                    {!item.product?.isAvailable && (
                      <p className="mt-1 text-xs text-amber-400">
                        Unavailable
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 text-slate-300">
                    {item.product
                      ? formatPrice(item.product.price)
                      : "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-white/10" />

            <div className="flex justify-between gap-4 text-lg font-bold text-white">
              <span>Estimated Total</span>

              <span className="text-emerald-400">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Final product availability and prices are verified by our
              server when your order is placed.
            </p>

            <Link
              href="/cart"
              className="mt-6 inline-flex text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              ← Return to Cart
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
