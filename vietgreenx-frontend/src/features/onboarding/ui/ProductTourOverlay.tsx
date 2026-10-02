"use client";

import { Leaf } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

import { getTourCopy } from "../tour.constants";
import type { TourStep } from "../tour.types";

const SPOTLIGHT_PAD = 10;
const TOOLTIP_WIDTH = 340;
const TOOLTIP_GAP = 14;
const VIEWPORT_PAD = 16;

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipLayout {
  top: number;
  left: number;
  width: number;
  placement: TooltipPlacement;
  arrowOffset: number;
}

interface ProductTourOverlayProps {
  locale: AppLocale;
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  targetRect: SpotlightRect | null;
  onSkip: () => void;
  onNext: () => void;
}

function computeTooltipLayout(
  targetRect: SpotlightRect,
  tooltipHeight: number,
  tooltipWidth = TOOLTIP_WIDTH,
): TooltipLayout {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  const spaceBelow = viewportH - (targetRect.top + targetRect.height);
  const spaceAbove = targetRect.top;
  const spaceRight = viewportW - (targetRect.left + targetRect.width);
  const spaceLeft = targetRect.left;

  let placement: TooltipPlacement = "bottom";
  if (spaceBelow >= tooltipHeight + TOOLTIP_GAP) {
    placement = "bottom";
  } else if (spaceAbove >= tooltipHeight + TOOLTIP_GAP) {
    placement = "top";
  } else if (spaceRight >= tooltipWidth + TOOLTIP_GAP) {
    placement = "right";
  } else if (spaceLeft >= tooltipWidth + TOOLTIP_GAP) {
    placement = "left";
  } else {
    placement = spaceBelow >= spaceAbove ? "bottom" : "top";
  }

  let top = 0;
  let left = 0;

  switch (placement) {
    case "bottom":
      top = targetRect.top + targetRect.height + TOOLTIP_GAP;
      left = targetCenterX - tooltipWidth / 2;
      break;
    case "top":
      top = targetRect.top - tooltipHeight - TOOLTIP_GAP;
      left = targetCenterX - tooltipWidth / 2;
      break;
    case "right":
      top = targetCenterY - tooltipHeight / 2;
      left = targetRect.left + targetRect.width + TOOLTIP_GAP;
      break;
    case "left":
      top = targetCenterY - tooltipHeight / 2;
      left = targetRect.left - tooltipWidth - TOOLTIP_GAP;
      break;
  }

  left = Math.max(VIEWPORT_PAD, Math.min(left, viewportW - tooltipWidth - VIEWPORT_PAD));
  top = Math.max(VIEWPORT_PAD, Math.min(top, viewportH - tooltipHeight - VIEWPORT_PAD));

  const arrowOffset =
    placement === "top" || placement === "bottom"
      ? Math.max(24, Math.min(targetCenterX - left, tooltipWidth - 24))
      : 0;

  return { top, left, width: tooltipWidth, placement, arrowOffset };
}

function TourProgressDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === current
              ? "w-5 bg-primary"
              : i < current
                ? "w-1.5 bg-primary/45"
                : "w-1.5 bg-muted-foreground/25",
          )}
        />
      ))}
    </div>
  );
}

function TourArrow({ placement }: { placement: TooltipPlacement }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-3 w-3 rotate-45 border border-border/80 bg-card",
        placement === "bottom" && "-top-1.5 -translate-x-1/2 border-b-0 border-r-0",
        placement === "top" && "-bottom-1.5 -translate-x-1/2 border-l-0 border-t-0",
        placement === "right" && "-left-1.5 border-b-0 border-l-0",
        placement === "left" && "-right-1.5 border-r-0 border-t-0",
      )}
      style={
        placement === "bottom" || placement === "top"
          ? { left: "var(--tour-arrow-x)" }
          : { top: "50%", transform: "translateY(-50%) rotate(45deg)" }
      }
    />
  );
}

export function ProductTourOverlay({
  locale,
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onSkip,
  onNext,
}: ProductTourOverlayProps) {
  const copy = getTourCopy(locale);
  const isLast = stepIndex === totalSteps - 1;
  const isCenter = step.kind === "center" || !targetRect;
  const isWelcome = step.id === "welcome";
  const isFinish = step.id === "finish";

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipLayout, setTooltipLayout] = useState<TooltipLayout | null>(null);

  useLayoutEffect(() => {
    if (isCenter || !targetRect) {
      setTooltipLayout(null);
      return;
    }

    const node = tooltipRef.current;
    if (!node) return;

    const measure = () => {
      const height = node.offsetHeight;
      const width = Math.min(TOOLTIP_WIDTH, node.offsetWidth || TOOLTIP_WIDTH);
      if (height > 0) {
        setTooltipLayout(computeTooltipLayout(targetRect, height, width));
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isCenter, targetRect, step.id, stepIndex, step.title, step.description]);

  const spotlightStyle = targetRect
    ? {
        top: targetRect.top - SPOTLIGHT_PAD,
        left: targetRect.left - SPOTLIGHT_PAD,
        width: targetRect.width + SPOTLIGHT_PAD * 2,
        height: targetRect.height + SPOTLIGHT_PAD * 2,
      }
    : undefined;

  return (
    <div
      className="fixed inset-0 z-[200] animate-in fade-in-0 duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-tour-title"
    >
      {isCenter ? (
        <div
          className="absolute inset-0 bg-neutral-950/60 backdrop-blur-[3px]"
          aria-hidden
          onClick={onSkip}
        />
      ) : (
        <>
          <div className="absolute inset-0" aria-hidden onClick={onSkip} />
          {targetRect && (
            <div
              className="pointer-events-none absolute rounded-xl ring-2 ring-primary/90 ring-offset-2 ring-offset-transparent animate-in zoom-in-95 duration-300"
              style={{
                ...spotlightStyle,
                boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.62), 0 0 24px 4px hsl(var(--primary) / 0.25)",
              }}
            />
          )}
        </>
      )}

      <div
        key={step.id}
        ref={tooltipRef}
        className={cn(
          "absolute overflow-hidden border border-border/80 bg-card shadow-lg animate-in fade-in-0 duration-300",
          isCenter
            ? "left-1/2 top-1/2 w-[min(100%-2rem,420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 sm:p-7 slide-in-from-bottom-2"
            : "max-w-[calc(100vw-2rem)] rounded-xl p-4 sm:p-5",
        )}
        style={
          isCenter
            ? undefined
            : tooltipLayout
              ? ({
                  top: tooltipLayout.top,
                  left: tooltipLayout.left,
                  width: tooltipLayout.width,
                  maxWidth: "calc(100vw - 2rem)",
                  ["--tour-arrow-x" as string]: `${tooltipLayout.arrowOffset}px`,
                } as React.CSSProperties)
              : {
                  top: VIEWPORT_PAD,
                  left: VIEWPORT_PAD,
                  width: Math.min(TOOLTIP_WIDTH, window.innerWidth - VIEWPORT_PAD * 2),
                  maxWidth: "calc(100vw - 2rem)",
                  visibility: "hidden" as const,
                }
        }
      >
        {!isCenter && tooltipLayout && <TourArrow placement={tooltipLayout.placement} />}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {isCenter && (isWelcome || isFinish) && (
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Leaf className="h-5 w-5" aria-hidden />
              </div>
            )}

            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
              {copy.stepOf(stepIndex + 1, totalSteps)}
            </p>
            <h2
              id="product-tour-title"
              className={cn(
                "mt-1.5 font-semibold tracking-tight text-foreground",
                isCenter ? "text-xl sm:text-2xl" : "text-lg",
              )}
            >
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-border/60 pt-4 sm:mt-5">
          <TourProgressDots current={stepIndex} total={totalSteps} />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onSkip}
              className="rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {copy.skip}
            </button>
            <Button type="button" onClick={onNext} className="min-w-[7.5rem] shadow-sm">
              {isLast ? copy.finishBtn : copy.next}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function measureTourTarget(selector: string): SpotlightRect | null {
  const el = document.querySelector(`[data-tour="${selector}"]`);
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export { SPOTLIGHT_PAD };
