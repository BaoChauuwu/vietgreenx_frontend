// shared/ui/StepIndicator.tsx
// =============================================================================
// Visual step progress cho wizard (register, onboarding, green profile create...).
//
//
// =============================================================================
import { Check } from "lucide-react";

import { cn } from "@/shared/lib/cn";

interface StepIndicatorProps {
  /** Tổng số bước */
  total: number;
  /** Bước hiện tại (1-indexed) */
  current: number;
  /** Label tooltip cho từng bước (optional) */
  labels?: string[];
  className?: string;
}

export function StepIndicator({ total, current, labels, className }: StepIndicatorProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={labels?.[current - 1] ?? `Bước ${current} / ${total}`}
      className={cn("flex items-center justify-center", className)}
    >
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;

        return (
          <div key={stepNum} className="flex items-center">
            {/* Circle */}
            <div
              title={labels?.[i]}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                isDone && "bg-primary text-primary-foreground",
                isActive &&
                  "bg-primary text-primary-foreground shadow-[0_0_0_4px_hsl(var(--primary)/0.2)]",
                !isDone && !isActive && "bg-muted text-muted-foreground",
              )}
            >
              {isDone ? <Check className="size-4" strokeWidth={2.5} aria-hidden /> : stepNum}
            </div>

            {stepNum < total && (
              <div
                className={cn(
                  "h-px w-10 transition-colors duration-300",
                  stepNum < current ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
