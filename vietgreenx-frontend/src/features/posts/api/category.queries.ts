"use client";

import { useQuery } from "@tanstack/react-query";

import { categoryService } from "./category.service";

/** Agriculture catalog — changes infrequently (DEV-PLAYBOOK cache guidance). */
const CATEGORY_STALE_MS = 30 * 60 * 1000;

export const postCategoryKeys = {
  all: ["categories", "agriculture"] as const,
  list: () => [...postCategoryKeys.all, "list"] as const,
};

export function useAgricultureCategories() {
  return useQuery({
    queryKey: postCategoryKeys.list(),
    queryFn: async () => {
      const result = await categoryService.list(1, 100);
      return result.items;
    },
    staleTime: CATEGORY_STALE_MS,
  });
}
