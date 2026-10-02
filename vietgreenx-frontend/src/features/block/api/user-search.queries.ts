"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/shared/auth";

import { userSearchService } from "./user-search.service";

export const userSearchKeys = {
  all: ["users", "search"] as const,
  query: (q: string) => [...userSearchKeys.all, q] as const,
};

export function useUserSearch(searchQuery: string, enabled = true) {
  const { user } = useUser();
  const trimmed = searchQuery.trim();
  return useQuery({
    queryKey: userSearchKeys.query(trimmed),
    queryFn: () => userSearchService.search(trimmed, 10),
    enabled: Boolean(user?.id) && enabled && trimmed.length >= 2,
    staleTime: 30_000,
  });
}
