"use client";

import { Send } from "lucide-react";

import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { SubmitButton } from "@/shared/ui/submit-button";

interface FooterNewsletterProps {
  hint: string;
  placeholder: string;
  submitAriaLabel: string;
}

export function FooterNewsletter({ hint, placeholder, submitAriaLabel }: FooterNewsletterProps) {
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit();

  const onSubmit = guardFormEvent(() => {
    // Newsletter API not wired yet — release immediately after noop submit.
    release();
  });

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <p className="text-sm text-foreground/75">{hint}</p>
      <GuardedForm
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-1"
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      >
        <Input
          type="email"
          name="email"
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          required
        />
        <SubmitButton
          type="submit"
          size="icon"
          aria-label={submitAriaLabel}
          isSubmitting={isSubmitting}
          className="shrink-0"
        >
          <Send className="size-4" />
        </SubmitButton>
      </GuardedForm>
    </div>
  );
}
