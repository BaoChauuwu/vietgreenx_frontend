import { z } from "zod";

export const categoryParentSchema = z.object({
  id: z.string().uuid(),
  nameVi: z.string(),
  nameEn: z.string(),
  slug: z.string(),
});

export const categorySchema = z.object({
  id: z.string().uuid(),
  nameVi: z.string(),
  nameEn: z.string(),
  slug: z.string(),
  iconUrl: z.string().nullable(),
  sortOrder: z.number().int(),
  parentId: z.string().uuid().nullable(),
  parent: categoryParentSchema.nullable(),
});

export const categoryListSchema = z.object({
  items: z.array(categorySchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPage: z.number().int().nonnegative(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryList = z.infer<typeof categoryListSchema>;
