
"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Contact Nexora
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Let&apos;s talk.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Have a question about our projects or need help getting
            started? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                ✉
              </div>

              <h2 className="mt-5 text-xl font-bold">Email support</h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Contact us with product questions, purchase inquiries,
                or download assistance.
              </p>

              <p className="mt-4 break-words text-sm font-medium text-blue-400">
                hello@nexora.dev
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Placeholder contact address — replace before launch.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-xl font-bold">How can we help?</h2>

              <ul className="mt-5 space-y-4 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="text-blue-400">✓</span>
                  Questions about source-code projects
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">✓</span>
                  Purchase and download assistance
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">✓</span>
                  Deployment assistance inquiries
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 lg:col-span-3">
            <h2 className="text-2xl font-bold">Send us a message</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Fill in the details below and we&apos;ll be ready to
              connect this form to our support system.
            </p>

            {submitted ? (
              <div
                role="status"
                className="mt-8 rounded-xl border border-blue-500/30 bg-blue-500/10 p-5"
              >
                <h3 className="font-semibold text-blue-300">
                  Form demonstration complete
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The form is working as a front-end demonstration,
                  but your message has not been sent. We&apos;ll connect
                  secure message delivery before launch.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  Return to the form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    What can we help with?
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    <option value="product">Product inquiry</option>
                    <option value="purchase">Purchase or download</option>
                    <option value="deployment">Deployment assistance</option>
                    <option value="other">Other question</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Your message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-500 px-6 py-4 font-bold text-white transition hover:bg-blue-400"
                >
                  Submit Message →
                </button>

                <p className="text-xs leading-5 text-slate-500">
                  This is a demonstration form. Do not enter sensitive
                  or confidential information.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
