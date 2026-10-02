import { useQuery } from "@tanstack/react-query";
import { categoryClientService } from "./category.service";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (limit = 100) => [...categoryKeys.all, { limit }] as const,
};

export function useCategories(limit = 100) {
  return useQuery({
    queryKey: categoryKeys.list(limit),
    queryFn: () => categoryClientService.findAll(limit),
    staleTime: 300_000,
  });
}
