import { z } from "zod";
import { postSchema } from "@/entities/post";
import { productSchema } from "@/entities/product";

export const searchTypeSchema = z.enum(["posts", "users", "products"]);
export type SearchType = z.infer<typeof searchTypeSchema>;

export const userSearchItemSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});
export type UserSearchItem = z.infer<typeof userSearchItemSchema>;

export const searchUsersResultSchema = z.object({
  items: z.array(userSearchItemSchema).default([]),
  nextCursor: z.string().nullable().optional(),
  hasNext: z.boolean().default(false),
});
export type SearchUsersResult = z.infer<typeof searchUsersResultSchema>;

export const searchPostsResultSchema = z.object({
  items: z.array(postSchema).default([]),
  nextCursor: z.string().nullable().optional(),
  hasNext: z.boolean().default(false),
});
export type SearchPostsResult = z.infer<typeof searchPostsResultSchema>;

export const searchProductsResultSchema = z.object({
  items: z.array(productSchema).default([]),
  nextCursor: z.string().nullable().optional(),
  hasNext: z.boolean().default(false),
});
export type SearchProductsResult = z.infer<typeof searchProductsResultSchema>;

export const globalSearchOverviewSchema = z.object({
  users: searchUsersResultSchema.default({ items: [], nextCursor: null, hasNext: false }),
  posts: searchPostsResultSchema.default({ items: [], nextCursor: null, hasNext: false }),
  products: searchProductsResultSchema.default({ items: [], nextCursor: null, hasNext: false }),
});
export type GlobalSearchOverview = z.infer<typeof globalSearchOverviewSchema>;
