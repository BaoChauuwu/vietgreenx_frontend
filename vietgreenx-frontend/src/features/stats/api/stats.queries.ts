"use client";

import { useQuery } from "@tanstack/react-query";

import { statsService } from "./stats.service";

export const statsKeys = {
  all: ["stats"] as const,
  public: () => [...statsKeys.all, "public"] as const,
};

export function usePublicStats() {
  return useQuery({
    queryKey: statsKeys.public(),
    queryFn: () => statsService.getPublicStats(),
    staleTime: 30 * 60_000,
  });
}
