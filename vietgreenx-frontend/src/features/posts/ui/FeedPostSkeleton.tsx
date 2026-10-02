import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

export function FeedPostSkeleton() {
  return (
    <ElevatedCard>
      <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
        <div className="size-11 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="min-w-0 flex-1 space-y-2 pt-0.5">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="space-y-2">
          <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
          <div className="h-3.5 w-[85%] animate-pulse rounded bg-muted" />
        </div>
        <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted" />
        <div className="flex justify-between px-0.5 pt-1">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-3 gap-1 border-t border-border/80 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-muted/80" />
          ))}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
