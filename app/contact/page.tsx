
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

        {/* Page heading */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Contact Nexora
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Let&apos;s talk.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Have a question about our software projects, need help
            with a purchase, or want to discuss deployment assistance?
            We&apos;re here to help.
          </p>
        </div>

        {/* Main two-column layout */}
        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-5">

          {/* Left column: Business contact details */}
          <div className="flex h-full flex-col gap-6 lg:col-span-2">

            {/* Email support */}
            <div className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                ✉
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Email support
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                For product questions, purchase inquiries, technical
                assistance, or other business-related queries.
              </p>

              <p className="mt-auto break-words pt-5 text-sm font-medium text-blue-400">
                XXXX
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Official business email address
              </p>
            </div>

            {/* Phone support */}
            <div className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                ☎
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Phone support
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                You can reach our business using the official
                contact number below.
              </p>

              <p className="mt-auto pt-5 text-sm font-medium text-blue-400">
                XXXX
              </p>
            </div>

            {/* Office address */}
            <div className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                📍
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Office address
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Business correspondence and official communication:
              </p>

              <address className="mt-auto pt-5 not-italic text-sm leading-7 text-slate-300">
                Divine flame IT Solutions
                <br />
                XXXX
                <br />
                XXXX
                <br />
                City, State - PIN Code
                <br />
                India
              </address>
            </div>
          </div>

          {/* Right column: Form and assistance */}
          <div className="flex h-full flex-col gap-8 lg:col-span-3">

            {/* Contact form */}
            <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
              <h2 className="text-2xl font-bold">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Complete the form below with your inquiry. Our
                contact form will be connected to secure email
                delivery before the website launches.
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
                    Your form submission was received by the
                    demonstration interface, but no email has
                    been sent. Secure message delivery will be
                    configured before launch.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                  >
                    Return to the form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                  {/* Name */}
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
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Email */}
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
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Subject */}
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
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>

                      <option value="product">
                        Product inquiry
                      </option>

                      <option value="purchase">
                        Purchase or download assistance
                      </option>

                      <option value="deployment">
                        Deployment assistance
                      </option>

                      <option value="business">
                        Business inquiry
                      </option>

                      <option value="other">
                        Other question
                      </option>
                    </select>
                  </div>

                  {/* Message */}
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
                      className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-500 px-6 py-4 font-bold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Submit Message →
                  </button>

                  <p className="text-xs leading-5 text-slate-500">
                    Please do not include passwords, payment
                    credentials, or other sensitive information.
                  </p>
                </form>
              )}
            </div>

            {/* How can we help? */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
              <h2 className="text-xl font-bold">
                How can we help?
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3 text-sm leading-6 text-slate-300">
                  <span className="text-blue-400">✓</span>
                  Questions about software projects and source code
                </div>

                <div className="flex gap-3 text-sm leading-6 text-slate-300">
                  <span className="text-blue-400">✓</span>
                  Purchase and download assistance
                </div>

                <div className="flex gap-3 text-sm leading-6 text-slate-300">
                  <span className="text-blue-400">✓</span>
                  Deployment and technical assistance
                </div>

                <div className="flex gap-3 text-sm leading-6 text-slate-300">
                  <span className="text-blue-400">✓</span>
                  Business and general inquiries
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business identity */}
        <div className="mt-14 border-t border-slate-800 pt-8 text-center">
          <p className="text-sm font-semibold text-slate-300">
            Nexora
          </p>

          <p className="mt-2 text-sm text-slate-500">
            A digital marketplace operated by Divine flame IT Solutions.
          </p>
        </div>

      </div>
    </main>
  );
}
