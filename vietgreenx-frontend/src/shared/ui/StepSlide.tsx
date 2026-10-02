// shared/ui/StepSlide.tsx
// =============================================================================
//
//
//   <StepSlide key={step} direction={direction}>
//     {step === 1 && <Step1 />}
//     {step === 2 && <Step2 />}
//   </StepSlide>
//
//
// =============================================================================
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type StepDirection = "forward" | "backward";

interface StepSlideProps {
  /** Hướng chuyển step — forward: slide từ phải, backward: slide từ trái */
  direction: StepDirection;
  children: ReactNode;
  className?: string;
}

export function StepSlide({ direction, children, className }: StepSlideProps) {
  return (
    <div
      className={cn(
        "duration-200 animate-in fade-in fill-mode-both",
        direction === "forward" ? "slide-in-from-right-4" : "slide-in-from-left-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
