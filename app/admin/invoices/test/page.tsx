//************/ for Indian User *******************
"use client";

import { useState } from "react";

export default function InvoiceTestPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendRequest(method: "POST" | "DELETE") {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/invoices/test", {
        method,
        credentials: "include",
      });

      const data = await response.json();

      setMessage(
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-12">
      <h1 className="text-2xl font-bold">
        Invoice Testing
      </h1>

      <p className="text-sm text-gray-500">
        Development-only invoice testing. Sign in with your admin account.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => sendRequest("DELETE")}
          disabled={loading}
          className="rounded-lg bg-red-600 px-5 py-3 text-white disabled:opacity-50"
        >
          Delete Existing Dummy Invoice
        </button>

        <button
          onClick={() => sendRequest("POST")}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
        >
          Generate New Dummy Invoice
        </button>
      </div>

      {loading && <p>Processing request...</p>}

      {message && (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-4 text-sm text-gray-900">
          {message}
        </pre>
      )}
    </main>
  );
}





