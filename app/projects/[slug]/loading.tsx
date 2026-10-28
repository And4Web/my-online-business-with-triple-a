
export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div
        className="mx-auto max-w-4xl animate-pulse"
        role="status"
      >
        <p className="text-slate-400">
          Loading project details...
        </p>
      </div>
    </main>
  );
}
