"use client";

import { useEffect, useState } from "react";

import { useCheckUsernameAvailability } from "../api/auth.queries";
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
  delayMs = 400,
): UsernameAvailabilityState {
  const trimmed = value.trim();
  const [debounced, setDebounced] = useState(trimmed);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(trimmed), delayMs);
    return () => window.clearTimeout(timer);
  }, [trimmed, delayMs]);

  const checkable = isUsernameCheckable(debounced);
  const query = useCheckUsernameAvailability(checkable ? debounced : "");

  let status: UsernameAvailabilityStatus = "idle";
  if (!checkable) {
    status = "idle";
  } else if (query.isFetching) {
    status = "checking";
  } else if (query.isError) {
    status = "available";
  } else if (query.data?.available) {
    status = "available";
  } else if (query.data && !query.data.available) {
    status = "taken";
  }

  return {
    status,
    isConfirmedAvailable: status === "available",
    isChecking: status === "checking",
  };
}
