"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollSentinelOptions {
  enabled: boolean;
  onLoadMore: () => void;
  /** Prefetch before the sentinel reaches the viewport edge (FB-style). */
  rootMargin?: string;
}

export function useInfiniteScrollSentinel({
  enabled,
  onLoadMore,
  rootMargin = "320px 0px",
}: UseInfiniteScrollSentinelOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!enabled) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { root: null, rootMargin, threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}
