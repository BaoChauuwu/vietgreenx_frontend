"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/lib/cn";

import type { TextareaCaretViewportPosition } from "../lib/get-textarea-caret-coordinates";
import type { HashtagPanelPhase } from "../lib/use-post-hashtag-typeahead";
import type { HashtagSearchItem } from "../model/hashtag.schema";
import { PostHashtagSuggestPanel } from "./PostHashtagSuggestPanel";

const PANEL_WIDTH = 288; // w-72
const VIEWPORT_MARGIN = 12;
const CARET_GAP = 6;
const ESTIMATED_PANEL_HEIGHT = 160;

interface PostHashtagSuggestDropdownProps {
  open: boolean;
  caret: TextareaCaretViewportPosition;
  phase: HashtagPanelPhase;
  query: string;
  suggestions: HashtagSearchItem[];
  highlightIndex: number;
  copy: {
    useCustom: (tag: string) => string;
    searchError: string;
    postCount: (count: number) => string;
  };
  onSelect: (tag: string) => void;
  onHighlight: (index: number) => void;
}

function resolveDropdownStyle(caret: TextareaCaretViewportPosition): {
  top: number;
  left: number;
} {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = caret.left;
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, viewportWidth - PANEL_WIDTH - VIEWPORT_MARGIN));

  const belowTop = caret.top + caret.height + CARET_GAP;
  const aboveTop = caret.top - ESTIMATED_PANEL_HEIGHT - CARET_GAP;
  const fitsBelow = belowTop + ESTIMATED_PANEL_HEIGHT <= viewportHeight - VIEWPORT_MARGIN;
  const top = fitsBelow ? belowTop : Math.max(VIEWPORT_MARGIN, aboveTop);

  return { top, left };
}

export function PostHashtagSuggestDropdown({
  open,
  caret,
  phase,
  query,
  suggestions,
  highlightIndex,
  copy,
  onSelect,
  onHighlight,
}: PostHashtagSuggestDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open) return;
    setStyle(resolveDropdownStyle(caret));
  }, [open, caret]);

  if (!mounted || !open || phase === "idle") return null;

  return createPortal(
    <div
      role="presentation"
      className={cn(
        "fixed z-[100] w-72 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
        "animate-in fade-in-0 slide-in-from-top-1 duration-150",
      )}
      style={{ top: style.top, left: style.left }}
    >
      <PostHashtagSuggestPanel
        phase={phase}
        query={query}
        suggestions={suggestions}
        highlightIndex={highlightIndex}
        copy={copy}
        onSelect={onSelect}
        onHighlight={onHighlight}
      />
    </div>,
    document.body,
  );
}
