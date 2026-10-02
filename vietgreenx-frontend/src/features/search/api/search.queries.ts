"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { searchService } from "./search.service";
import type { SearchType } from "../model/search.schema";

export const searchQueryKeys = {
  all: ["global-search"] as const,
  overview: (q: string) => [...searchQueryKeys.all, "overview", q] as const,
  byType: (q: string, type: SearchType) => [...searchQueryKeys.all, type, q] as const,
};

const DEFAULT_PAGE_SIZE = 12;

export function useGlobalSearchOverview(q: string) {
  const trimmed = q.trim();
  return useQuery({
    queryKey: searchQueryKeys.overview(trimmed),
    queryFn: () => searchService.getOverview(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 60_000,
  });
}

export function useSearchUsersInfinite(q: string) {
  const trimmed = q.trim();
  return useInfiniteQuery({
    queryKey: searchQueryKeys.byType(trimmed, "users"),
    queryFn: ({ pageParam }) =>
      searchService.searchUsers({
        q: trimmed,
        cursor: pageParam ?? undefined,
        limit: DEFAULT_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: trimmed.length > 0,
    staleTime: 30_000,
  });
}

export function useSearchPostsInfinite(q: string) {
  const trimmed = q.trim();
  return useInfiniteQuery({
    queryKey: searchQueryKeys.byType(trimmed, "posts"),
    queryFn: ({ pageParam }) =>
      searchService.searchPosts({
        q: trimmed,
        cursor: pageParam ?? undefined,
        limit: DEFAULT_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: trimmed.length > 0,
    staleTime: 30_000,
  });
}

export function useSearchProductsInfinite(q: string) {
  const trimmed = q.trim();
  return useInfiniteQuery({
    queryKey: searchQueryKeys.byType(trimmed, "products"),
    queryFn: ({ pageParam }) =>
      searchService.searchProducts({
        q: trimmed,
        cursor: pageParam ?? undefined,
        limit: DEFAULT_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: trimmed.length > 0,
    staleTime: 30_000,
  });
}
