import { Leaf, QrCode } from "lucide-react";

import { cn } from "@/shared/lib/cn";

interface FeedPhonePreviewProps {
  className?: string;
}

/** Miniature in-phone feed UI — shared by landing hero and auth story panel. */
export function FeedPhonePreview({ className }: FeedPhonePreviewProps) {
  return (
    <div className={cn("flex h-full min-h-[420px] flex-col bg-background text-[10px] leading-tight", className)}>
      <div className="flex items-center justify-between border-b border-border/80 bg-primary px-3 py-2.5 text-primary-foreground">
        <span className="text-[11px] font-semibold tracking-tight">VietGreenX</span>
        <Leaf className="size-3.5 opacity-90" aria-hidden />
      </div>

      <div className="space-y-2 border-b border-border/60 p-2.5">
        <div className="h-7 rounded-md bg-muted/80" />
        <div className="flex justify-end">
          <div className="rounded-md bg-primary px-2.5 py-1 text-[9px] font-medium text-primary-foreground">
            Đăng bài
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 overflow-hidden p-2.5">
        <article className="rounded-lg border border-border bg-card p-2 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="size-6 shrink-0 rounded-full bg-primary/15" />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="h-2 w-16 rounded bg-foreground/15" />
              <div className="h-1.5 w-10 rounded bg-muted-foreground/25" />
            </div>
            <QrCode className="size-3 shrink-0 text-tertiary" aria-hidden />
          </div>
          <div className="mt-2 h-2 w-full rounded bg-foreground/10" />
          <div className="mt-1 h-2 w-[80%] rounded bg-foreground/10" />
          <div className="mt-2 aspect-[16/10] overflow-hidden rounded-md bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100">
            <div className="flex h-full items-end p-2">
              <span className="rounded bg-card/90 px-1.5 py-0.5 text-[8px] font-medium text-primary">
                Rau sạch Đà Lạt
              </span>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-border bg-card p-2 opacity-80">
          <div className="flex items-center gap-2">
            <div className="size-6 shrink-0 rounded-full bg-secondary/20" />
            <div className="h-2 w-14 rounded bg-foreground/15" />
          </div>
          <div className="mt-2 h-16 rounded-md bg-muted/70" />
        </article>
      </div>
    </div>
  );
}
