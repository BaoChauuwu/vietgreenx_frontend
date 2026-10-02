// src/shared/ui/input.tsx — shadcn/ui Input
import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";
import { formFieldClass } from "@/shared/ui/form-field";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border px-3 py-2 text-sm",
        formFieldClass,
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
