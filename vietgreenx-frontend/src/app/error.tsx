// src/app/error.tsx — Next.js route-level error UI (App Router convention).
// Catches errors thrown in Server/Client Components during rendering for this
// segment. Must be a Client Component.
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Error</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
        Reload
      </button>
    </div>
  );
}
