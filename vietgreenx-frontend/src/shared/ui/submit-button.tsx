"use client";

import { Loader2 } from "lucide-react";
import { forwardRef, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { Button, type ButtonProps } from "./button";

export interface SubmitButtonProps extends ButtonProps {
  isSubmitting?: boolean;
  loadingLabel?: ReactNode;
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    {
      isSubmitting = false,
      loadingLabel,
      children,
      disabled,
      className,
      size = "lg",
      type = "submit",
      ...props
    },
    ref,
  ) => (
    <Button
      ref={ref}
      type={type}
      size={size}
      disabled={disabled || isSubmitting}
      aria-disabled={disabled || isSubmitting}
      aria-busy={isSubmitting}
      className={cn("bg-primary text-primary-foreground hover:bg-primary/90", className)}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  ),
);
SubmitButton.displayName = "SubmitButton";
