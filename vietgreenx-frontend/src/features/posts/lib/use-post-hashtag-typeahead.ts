"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";

import { useHashtagSearch } from "../api/hashtag.queries";
import { getActiveHashtagQuery } from "./hashtag-token";

export type HashtagPanelPhase =
  | "idle"
  | "debouncing"
  | "loading"
  | "ready"
  | "empty"
  | "error";

interface UsePostHashtagTypeaheadOptions {
  value: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  debounceMs?: number;
}

export function usePostHashtagTypeahead({
  value,
  textareaRef,
  debounceMs = 250,
}: UsePostHashtagTypeaheadOptions) {
  const [cursor, setCursor] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const syncCursor = () => {
    const el = textareaRef.current;
    setCursor(el?.selectionStart ?? value.length);
  };

  const activeQuery = useMemo(
    () => getActiveHashtagQuery(value, cursor),
    [value, cursor],
  );

  const searchQuery = activeQuery ?? "";
  /** Silent on lone `#` — open only from the first character after `#`. */
  const panelOpen = activeQuery !== null && searchQuery.length >= 1;

  useEffect(() => {
    if (!panelOpen) {
      setDebouncedQuery("");
      return;
    }

    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [panelOpen, searchQuery, debounceMs]);

  const fetchEnabled = panelOpen && debouncedQuery.length >= 1;
  const { data, isLoading, isFetching, isError } = useHashtagSearch(debouncedQuery, fetchEnabled);

  const suggestions = data?.items ?? [];
  const isDebouncing = panelOpen && searchQuery !== debouncedQuery;

  const panelPhase: HashtagPanelPhase = (() => {
    if (!panelOpen) return "idle";
    if (isDebouncing) return "debouncing";
    if (isError) return "error";
    if (isLoading || isFetching) return "loading";
    if (suggestions.length > 0) return "ready";
    return "empty";
  })();

  return {
    panelOpen,
    panelPhase,
    activeQuery: searchQuery,
    suggestions,
    cursor,
    syncCursor,
  };
}
