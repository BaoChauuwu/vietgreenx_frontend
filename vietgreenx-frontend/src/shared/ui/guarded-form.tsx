"use client";

import { type FormHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export interface GuardedFormProps extends FormHTMLAttributes<HTMLFormElement> {
  isSubmitting?: boolean;
  /** Extra classes on the inner fieldset (merged after `className`). */
  fieldsetClassName?: string;
  children: ReactNode;
}

export function GuardedForm({
  isSubmitting = false,
  fieldsetClassName,
  className,
  children,
  ...props
}: GuardedFormProps) {
  return (
    <form
      aria-busy={isSubmitting}
      className={cn("m-0 flex min-h-0 min-w-0 flex-1 flex-col p-0", className)}
      {...props}
    >
      <fieldset
        disabled={isSubmitting}
        className={cn(
          "m-0 flex h-full min-h-0 w-full min-w-0 flex-1 flex-col border-0 p-0",
          fieldsetClassName,
        )}
      >
        {children}
      </fieldset>
    </form>
  );
}
