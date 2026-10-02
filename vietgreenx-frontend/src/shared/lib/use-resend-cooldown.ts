"use client";

import { useCallback, useEffect, useState } from "react";

const COOLDOWN_SEC = 60;

export function useResendCooldown(storageKey: string) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const until = Number(sessionStorage.getItem(storageKey) ?? 0);
    const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    setSecondsLeft(remaining);
  }, [storageKey]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const startCooldown = useCallback(() => {
    if (typeof window === "undefined") return;
    const until = Date.now() + COOLDOWN_SEC * 1000;
    sessionStorage.setItem(storageKey, String(until));
    setSecondsLeft(COOLDOWN_SEC);
  }, [storageKey]);

  return {
    secondsLeft,
    canResend: secondsLeft <= 0,
    startCooldown,
  };
}
