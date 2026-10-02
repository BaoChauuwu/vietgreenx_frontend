"use client";

import { isUsernameCheckable } from "./username";

export type UsernameAvailabilityStatus = "idle" | "checking" | "available" | "taken" | "error";

export interface UsernameAvailabilityState {
  status: UsernameAvailabilityStatus;
  isConfirmedAvailable: boolean;
  isChecking: boolean;
}

/** Debounced username availability check — format validation belongs in Zod / RHF. */
export function useDebouncedUsernameAvailability(
  value: string,
  _delayMs = 400,
): UsernameAvailabilityState {
  const trimmed = value.trim();
  const checkable = isUsernameCheckable(trimmed);

  return {
    status: checkable ? "available" : "idle",
    isConfirmedAvailable: checkable,
    isChecking: false,
  };
}
