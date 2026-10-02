export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 px-4">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-muted mx-auto" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
