"use client";

import { useEffect, useRef, useState } from "react";

import type { ReactionType } from "@/entities/reaction";
import { REACTION_TYPES } from "@/entities/reaction";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";

import { REACTION_META, getReactionCopy } from "../reaction.constants";

interface ReactionButtonProps {
  currentReaction: ReactionType | null;
  isLiked: boolean;
  isPending: boolean;
  locale?: AppLocale;
  onReact: (type: ReactionType) => void;
}

export function ReactionButton({
  currentReaction,
  isLiked,
  isPending,
  locale = getClientLocale(),
  onReact,
}: ReactionButtonProps) {
  const copy = getReactionCopy(locale);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hoveredType, setHoveredType] = useState<ReactionType | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fix #3: cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const meta = currentReaction ? REACTION_META[currentReaction] : null;
  const emoji = meta?.emoji ?? "👍";
  const reactionLabel = meta ? (locale === "en" ? meta.labelEn : meta.labelVi) : copy.like;
  // Fix #7: use REACTION_META[type].color directly, no separate REACTION_COLORS map
  const activeColor = currentReaction ? REACTION_META[currentReaction].color : "";

  const openPicker = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setPickerOpen(true);
  };
  const closePicker = () => {
    closeTimeout.current = setTimeout(() => {
      setPickerOpen(false);
      setHoveredType(null);
    }, 200);
  };
  const startHoverOpen = () => {
    hoverTimeout.current = setTimeout(openPicker, 500);
  };
  const cancelHover = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  const handleClick = () => {
    if (pickerOpen) {
      setPickerOpen(false);
      return;
    }
    onReact(currentReaction ?? "like");
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => { cancelHover(); startHoverOpen(); }}
      onMouseLeave={() => { cancelHover(); closePicker(); }}
    >
      {/* Picker popup */}
      {pickerOpen && (
        <div
          className="absolute bottom-[calc(100%+6px)] left-1/2 z-50 -translate-x-1/2"
          onMouseEnter={() => { if (closeTimeout.current) clearTimeout(closeTimeout.current); }}
          onMouseLeave={closePicker}
        >
          {hoveredType && (
            <div className="mb-1.5 flex justify-center">
              <span className="rounded-full bg-foreground/80 px-2.5 py-0.5 text-[11px] font-semibold text-background backdrop-blur-sm">
                {locale === "en" ? REACTION_META[hoveredType].labelEn : REACTION_META[hoveredType].labelVi}
              </span>
            </div>
          )}
          <div className="flex items-end gap-0.5 rounded-full border border-border/60 bg-background/95 px-2.5 py-1.5 shadow-xl backdrop-blur-sm">
            {REACTION_TYPES.map((type) => {
              const m = REACTION_META[type];
              const isActive = currentReaction === type;
              const isHovered = hoveredType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onMouseEnter={() => setHoveredType(type)}
                  onMouseLeave={() => setHoveredType(null)}
                  onClick={() => { onReact(type); setPickerOpen(false); setHoveredType(null); }}
                  className={cn(
                    "relative flex items-center justify-center rounded-full transition-all duration-150 focus:outline-none",
                    "size-9 text-2xl",
                    isHovered ? "scale-[1.55] -translate-y-2" : "scale-100 translate-y-0",
                    isActive && !isHovered && "scale-110",
                  )}
                >
                  <span className="select-none leading-none">{m.emoji}</span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "flex w-full items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-semibold transition-colors sm:py-3 sm:text-sm",
          "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isLiked ? activeColor : "text-muted-foreground hover:text-foreground",
        )}
      >
        <span className={cn("text-lg leading-none sm:text-xl", isPending && "animate-pulse")}>
          {emoji}
        </span>
        <span>{reactionLabel}</span>
      </button>
    </div>
  );
}
