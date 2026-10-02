"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { postService } from "./post.service";

export const hashtagKeys = {
  all: ["posts", "hashtags"] as const,
  search: (query: string, limit: number) => [...hashtagKeys.all, "search", query, limit] as const,
};

interface UseHashtagSearchOptions {
  limit?: number;
  keepPrevious?: boolean;
}

export function useHashtagSearch(query: string, enabled: boolean, options: UseHashtagSearchOptions = {}) {
  const limit = options.limit ?? 10;

  return useQuery({
    queryKey: hashtagKeys.search(query, limit),
    queryFn: () => postService.searchHashtags(query, limit),
    enabled: enabled && query.trim().length >= 1,
    staleTime: 60_000,
    retry: 1,
    placeholderData: options.keepPrevious === false ? undefined : keepPreviousData,
  });
}
