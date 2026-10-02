"use client";

import { Hash, Plus } from "lucide-react";

import { cn } from "@/shared/lib/cn";

import type { HashtagPanelPhase } from "../lib/use-post-hashtag-typeahead";
import type { HashtagSearchItem } from "../model/hashtag.schema";

interface PostHashtagSuggestPanelProps {
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

function SuggestSkeletonRows() {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 px-3 py-2"
          aria-hidden
        >
          <div className="h-4 w-[4.5rem] animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-10 animate-pulse rounded-md bg-muted/80" />
        </div>
      ))}
    </>
  );
}

function SuggestRow({
  children,
  highlighted,
  onMouseDown,
  onMouseEnter,
}: {
  children: React.ReactNode;
  highlighted?: boolean;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={highlighted}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
        highlighted ? "bg-muted text-foreground" : "text-foreground/90 hover:bg-muted/70",
      )}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  );
}

export function PostHashtagSuggestPanel({
  phase,
  query,
  suggestions,
  highlightIndex,
  copy,
  onSelect,
  onHighlight,
}: PostHashtagSuggestPanelProps) {
  if (phase === "idle") return null;

  return (
    <div className="max-h-52 overflow-y-auto py-1" role="listbox">
      {phase === "debouncing" || phase === "loading" ? <SuggestSkeletonRows /> : null}

      {phase === "error" ? (
        <SuggestRow>
          <span className="text-xs leading-snug text-destructive">{copy.searchError}</span>
        </SuggestRow>
      ) : null}

      {phase === "empty" ? (
        <SuggestRow
          highlighted
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect(query);
          }}
        >
          <Plus className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-medium text-primary">
            {copy.useCustom(query)}
          </span>
        </SuggestRow>
      ) : null}

      {phase === "ready"
        ? suggestions.map((item, index) => (
            <SuggestRow
              key={item.tag}
              highlighted={index === highlightIndex}
              onMouseEnter={() => onHighlight(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(item.tag);
              }}
            >
              <Hash className="size-3.5 shrink-0 text-primary/80" aria-hidden />
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                {item.tag}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {copy.postCount(item.postCount)}
              </span>
            </SuggestRow>
          ))
        : null}
    </div>
  );
}
