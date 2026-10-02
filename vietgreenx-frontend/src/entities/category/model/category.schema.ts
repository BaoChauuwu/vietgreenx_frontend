import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  nameVi: z.string().optional().default(""),
  nameEn: z.string().optional().default(""),
  name: z.string().optional().default(""),
  slug: z.string().optional().default(""),
  iconUrl: z.string().nullable().optional(),
  sortOrder: z.number().optional().default(0),
  parentId: z.string().nullable().optional(),
});

export type CategoryItem = z.infer<typeof categorySchema>;

export const categoryListResponseSchema = z.object({
  items: z.array(categorySchema).optional().default([]),
  total: z.number().optional().default(0),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;
