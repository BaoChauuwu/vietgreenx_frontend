"use client";

import { Check, Loader2, X } from "lucide-react";
import { useEffect } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { cn } from "@/shared/lib/cn";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { getAuthCopy } from "../auth.constants";
import {
  useDebouncedUsernameAvailability,
  type UsernameAvailabilityState,
} from "../lib/use-debounced-username-check";
import { AUTH_FIELD_CLASS } from "./AuthFormPanel";

interface UsernameFieldProps {
  locale: AppLocale;
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  autoFocus?: boolean;
  onAvailabilityChange?: (state: UsernameAvailabilityState) => void;
}

export function UsernameField({
  locale,
  id = "username",
  value,
  onChange,
  onBlur,
  error,
  autoFocus,
  onAvailabilityChange,
}: UsernameFieldProps) {
  const copy = getAuthCopy(locale).register.account.username;
  const availability = useDebouncedUsernameAvailability(value);
  const { status } = availability;

  useEffect(() => {
    onAvailabilityChange?.({
      status: availability.status,
      isConfirmedAvailable: availability.isConfirmedAvailable,
      isChecking: availability.isChecking,
    });
  }, [
    availability.status,
    availability.isConfirmedAvailable,
    availability.isChecking,
    onAvailabilityChange,
  ]);

  const availabilityMessage =
    !error && status === "checking"
      ? copy.checking
      : !error && status === "available"
        ? copy.available
        : !error && status === "taken"
          ? copy.taken
          : !error && status === "error"
            ? copy.checkError
            : null;

  const StatusIcon =
    status === "checking"
      ? Loader2
      : status === "available"
        ? Check
        : status === "taken" || status === "error"
          ? X
          : null;

  const showAvailabilityIcon = Boolean(StatusIcon) && !error;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{copy.label}</Label>
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete="username"
          autoFocus={autoFocus}
          placeholder={copy.placeholder}
          spellCheck={false}
          aria-invalid={Boolean(error) || status === "taken" || status === "error"}
          className={cn(AUTH_FIELD_CLASS, showAvailabilityIcon ? "pr-10" : undefined)}
        />
        {showAvailabilityIcon && StatusIcon ? (
          <StatusIcon
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2",
              status === "checking" && "animate-spin text-muted-foreground",
              status === "available" && "text-emerald-600 dark:text-emerald-500",
              (status === "taken" || status === "error") && "text-destructive",
            )}
            aria-hidden
          />
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">{copy.hint}</p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!error && availabilityMessage ? (
        <p
          className={cn(
            "text-sm",
            status === "available" && "text-emerald-600 dark:text-emerald-500",
            (status === "taken" || status === "error") && "text-destructive",
            status === "checking" && "text-muted-foreground",
          )}
        >
          {availabilityMessage}
        </p>
      ) : null}
    </div>
  );
}
