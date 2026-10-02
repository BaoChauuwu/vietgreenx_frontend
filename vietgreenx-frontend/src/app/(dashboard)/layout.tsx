import { Suspense, type ReactNode } from "react";

import { AuthWrapper } from "@/shared/auth";
import { AppShell } from "@/widgets/app-shell";

function PageSkeleton() {
  return (
    <div className="flex min-h-screen animate-pulse flex-col gap-4 p-6">
      <div className="h-8 w-48 rounded-md bg-muted" />
      <div className="h-4 w-full max-w-md rounded bg-muted" />
      <div className="mt-4 grid gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 w-full rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthWrapper fallback={<PageSkeleton />}>
      <AppShell>
        <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
      </AppShell>
    </AuthWrapper>
  );
}
