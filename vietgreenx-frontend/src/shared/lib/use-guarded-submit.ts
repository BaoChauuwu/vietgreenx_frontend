"use client";

import { useCallback, type FormEvent } from "react";

import { useSubmitLock } from "./use-submit-lock";

export interface UseGuardedSubmitOptions {
  isPending?: boolean;
  enabled?: boolean;
}

export function useGuardedSubmit(options: UseGuardedSubmitOptions = {}) {
  const { isPending = false, enabled = true } = options;
  const { isLocked, acquire, release } = useSubmitLock();

  const isSubmitting = isLocked || isPending;
  const isDisabled = !enabled || isSubmitting;

  const guardFormEvent = useCallback(
    (handler: (event: FormEvent<HTMLFormElement>) => unknown) =>
      (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!enabled || isSubmitting) return;
        if (!acquire()) return;
        handler(event);
      },
    [enabled, isSubmitting, acquire],
  );

  const runGuarded = useCallback(
    (handler: () => void | Promise<void>) => {
      if (!enabled || isSubmitting) return false;
      if (!acquire()) return false;
      void Promise.resolve(handler()).catch(() => release());
      return true;
    },
    [enabled, isSubmitting, acquire, release],
  );

  return {
    isSubmitting,
    isDisabled,
    acquire,
    release,
    guardFormEvent,
    runGuarded,
  };
}
