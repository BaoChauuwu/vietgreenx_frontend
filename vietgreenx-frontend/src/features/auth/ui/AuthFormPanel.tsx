import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface AuthFormPanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Auth form container — 3-breakpoint card behavior:
 *  mobile  : flat (no card), content on white bg below image banner
 *  tablet+ : white card with rounded corners, border, shadow
 *  desktop : same card, slightly wider max-width
 */
export function AuthFormPanel({ children, className }: AuthFormPanelProps) {
  return (
    <div
      className={cn(
        // mobile: flat, full-width
        "flex w-full flex-col gap-5",
        // tablet+: white card
        "md:max-w-[500px] md:rounded-[28px] md:border md:border-primary md:bg-white md:px-8 md:py-8",
        "md:shadow-[0px_20px_60px_0px_rgba(3,134,69,0.08),0px_8px_24px_0px_rgba(0,0,0,0.04)]",
        // desktop: wider
        "xl:max-w-[580px] xl:px-10 xl:py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** @deprecated Import from `@/shared/ui/form-field` instead. */
export { AUTH_FIELD_CLASS, formFieldClass } from "@/shared/ui/form-field";
