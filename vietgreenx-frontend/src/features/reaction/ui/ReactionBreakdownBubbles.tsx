"use client";

import type { ReactionType } from "@/entities/reaction";
import { REACTION_TYPES } from "@/entities/reaction";

import { REACTION_META } from "../reaction.constants";

interface ReactionBreakdownBubblesProps {
  breakdown: Partial<Record<ReactionType, number>>;
  totalCount: number;
  onClick?: () => void;
}

const MAX_SHOWN = 3;

export function ReactionBreakdownBubbles({
  breakdown,
  totalCount,
  onClick,
}: ReactionBreakdownBubblesProps) {
  const sorted = REACTION_TYPES
    .filter((t) => (breakdown[t] ?? 0) > 0)
    .sort((a, b) => (breakdown[b] ?? 0) - (breakdown[a] ?? 0))
    .slice(0, MAX_SHOWN);

  if (!sorted.length || !totalCount) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
    >
      <span className="flex items-center">
        {sorted.map((type, i) => (
          <span
            key={type}
            title={REACTION_META[type].labelVi}
            className="flex size-5 items-center justify-center rounded-full border-2 border-card bg-background text-[11px] leading-none"
            style={{ marginLeft: i === 0 ? 0 : -6, zIndex: MAX_SHOWN - i }}
          >
            {REACTION_META[type].emoji}
          </span>
        ))}
      </span>
      <span>{totalCount}</span>
    </button>
  );
}
