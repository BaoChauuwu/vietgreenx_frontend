"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { markWelcomeSeen } from "@/shared/auth";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";

import { buildTourSteps } from "../lib/build-tour-steps";
import type { TourStep } from "../tour.types";
import { measureTourTarget, ProductTourOverlay } from "./ProductTourOverlay";

interface ProductTourProviderProps {
  locale?: AppLocale;
}

function tourRunKey(userId: string) {
  return `vgx_tour_run_${userId}`;
}

export function ProductTourProvider({ locale = getClientLocale() }: ProductTourProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status, refresh, can } = useUser();

  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<ReturnType<typeof measureTourTarget>>(null);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  /** Sync guard — prevents auto-restart after Skip/Done while refresh() is in flight. */
  const tourHandledRef = useRef(false);
  const finishingRef = useRef(false);

  const steps = useMemo(() => {
    if (!user) return [];
    return buildTourSteps(locale, can);
  }, [locale, user, can]);

  const currentStep: TourStep | undefined = steps[stepIndex];

  const shouldRunTour = status === "authenticated" && user && !user.onboardingCompleted;

  useEffect(() => {
    if (!user?.id || !shouldRunTour || steps.length === 0 || tourHandledRef.current) return;

    const runKey = tourRunKey(user.id);
    const alreadyMarkedRunning =
      typeof window !== "undefined" && sessionStorage.getItem(runKey) === "1";

    if (alreadyMarkedRunning) {
      if (!active) setActive(true);
      return;
    }

    sessionStorage.setItem(runKey, "1");
    setActive(true);
    setStepIndex(0);
  }, [user?.id, shouldRunTour, steps.length, active]);

  const finishTour = useCallback(async () => {
    if (!user?.id || tourHandledRef.current || finishingRef.current) return;

    finishingRef.current = true;
    tourHandledRef.current = true;

    // Sync first — refresh() is async; without this, auto-start effect re-fires.
    markWelcomeSeen(user.id);
    sessionStorage.removeItem(tourRunKey(user.id));

    setActive(false);

    try {
      await refresh();
      if (pathname !== ROUTES.feed) {
        router.replace(ROUTES.feed);
      }
    } finally {
      finishingRef.current = false;
    }
  }, [user?.id, refresh, pathname, router]);

  const goToStep = useCallback(
    (index: number) => {
      const step = steps[index];
      if (!step) return;

      if (pathname !== step.route) {
        setPendingRoute(step.route);
        router.push(step.route);
        setStepIndex(index);
        return;
      }

      setPendingRoute(null);
      setStepIndex(index);
    },
    [steps, pathname, router],
  );

  const handleNext = useCallback(() => {
    if (stepIndex >= steps.length - 1) {
      void finishTour();
      return;
    }
    goToStep(stepIndex + 1);
  }, [stepIndex, steps.length, finishTour, goToStep]);

  const handleSkip = useCallback(() => {
    void finishTour();
  }, [finishTour]);

  useEffect(() => {
    if (!active || !currentStep) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active, currentStep]);

  useEffect(() => {
    if (!active || !currentStep || tourHandledRef.current) return;

    if (pendingRoute && pathname !== pendingRoute) return;

    if (pathname !== currentStep.route) {
      router.push(currentStep.route);
      return;
    }

    const updateRect = () => {
      if (currentStep.kind === "center" || !currentStep.target) {
        setTargetRect(null);
        return;
      }

      setTargetRect(measureTourTarget(currentStep.target));
    };

    const raf = window.requestAnimationFrame(updateRect);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    const retry = window.setTimeout(updateRect, 350);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(retry);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [active, currentStep, pathname, pendingRoute, router]);

  useEffect(() => {
    if (pendingRoute && pathname === pendingRoute) {
      setPendingRoute(null);
    }
  }, [pathname, pendingRoute]);

  if (!active || !currentStep || steps.length === 0 || tourHandledRef.current) return null;

  return (
    <ProductTourOverlay
      locale={locale}
      step={currentStep}
      stepIndex={stepIndex}
      totalSteps={steps.length}
      targetRect={targetRect}
      onSkip={handleSkip}
      onNext={handleNext}
    />
  );
}
