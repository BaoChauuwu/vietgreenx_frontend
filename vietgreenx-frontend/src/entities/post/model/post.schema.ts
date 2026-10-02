import { z } from "zod";
// eslint-disable-next-line boundaries/element-types
import { reactionTypeSchema } from "@/entities/reaction";

export const POST_TAG_TYPES = ["product", "region", "category"] as const;

export const postTagTypeSchema = z.enum(POST_TAG_TYPES);

export const postTagSchema = z.object({
  tagType: z.string(),
  refId: z.string().nullable(),
  refLabel: z.string(),
});

export const POST_CONTENT_CATEGORIES = [
  "produce_story",
  "crop_journal",
  "farming_technique",
  "market_price",
  "trade_connection",
  "ocop_vietgap_story",
] as const;

export const postContentCategorySchema = z.enum(POST_CONTENT_CATEGORIES);

export const postAuthorSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
});

export const postMediaSchema = z.object({
  id: z.string(),
  cdnUrl: z.string(),
  mimeType: z.string(),
  position: z.number(),
  widthPx: z.number().nullable().optional(),
  heightPx: z.number().nullable().optional(),
});

export const vietShopPreviewSchema = z.object({
  productName: z.string(),
  shopUrl: z.string().url(),
});

export const postSchema = z.object({
  id: z.string(),
  body: z.string().nullable(),
  category: z.string().nullable().optional(),
  reactionCount: z.number().int().nonnegative(),
  viewerHasReacted: z.boolean().optional(),
  viewerReaction: reactionTypeSchema.nullable().optional(),
  reactionBreakdown: z.record(reactionTypeSchema, z.number().int().nonnegative()).optional(),
  commentCount: z.number().int().nonnegative(),
  shareCount: z.number().int().nonnegative().optional(),
  viewCount: z.number().int().nonnegative().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  author: postAuthorSchema,
  media: z.array(postMediaSchema),
  hashtags: z.array(z.string()).optional(),
  tags: z.array(postTagSchema).optional(),
  vietShopPreview: vietShopPreviewSchema.nullable().optional(),
});

export const postListSchema = z.object({
  items: z.array(postSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPage: z.number().int().nonnegative(),
});

export type PostTagType = z.infer<typeof postTagTypeSchema>;
export type PostTag = z.infer<typeof postTagSchema>;
export type PostContentCategory = z.infer<typeof postContentCategorySchema>;
export type Post = z.infer<typeof postSchema>;
export type PostAuthor = z.infer<typeof postAuthorSchema>;
export type PostMedia = z.infer<typeof postMediaSchema>;
export type PostList = z.infer<typeof postListSchema>;
export type VietShopPreview = z.infer<typeof vietShopPreviewSchema>;
