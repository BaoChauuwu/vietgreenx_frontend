export default function DashboardLoading() {
  return (
    <div className="w-full space-y-4 p-6">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>

      {/* Card rows */}
      <div className="mt-2 grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
