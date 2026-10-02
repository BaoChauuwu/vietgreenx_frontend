import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { FeedPhonePreview } from "./FeedPhonePreview";

interface ProductPhoneMockProps {
  className?: string;
  /** Override default feed preview screen content. */
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  sm: "w-[220px]",
  md: "w-[260px]",
  lg: "w-[280px]",
} as const;

export function ProductPhoneMock({ className, children, size = "lg" }: ProductPhoneMockProps) {
  return (
    <div
      className={cn("relative mx-auto", SIZE_CLASS[size], className)}
      aria-hidden={children ? undefined : true}
    >
      <div className="rounded-[2rem] border-2 border-neutral-300/90 bg-neutral-900 p-2 shadow-sm">
        <div className="overflow-hidden rounded-[1.4rem] bg-background ring-1 ring-black/5">
          {children ?? <FeedPhonePreview />}
        </div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-2 h-1 w-16 -translate-x-1/2 rounded-full bg-neutral-700/80" />
    </div>
  );
}
