import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";
import { formFieldClass } from "@/shared/ui/form-field";

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border px-3 py-2 text-sm",
        formFieldClass,
        "ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export { Select };
