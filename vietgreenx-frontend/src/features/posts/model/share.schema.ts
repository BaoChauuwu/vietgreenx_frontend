import { z } from "zod";

export const shareTypeSchema = z.enum(["repost", "external_link"]);

export const createShareInputSchema = z.object({
  postId: z.string().uuid(),
  caption: z.string().max(2000).optional(),
  shareType: shareTypeSchema.optional(),
});

export const shareResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  caption: z.string().optional(),
  shareType: shareTypeSchema,
  createdAt: z.string(),
  repostPostId: z.string().uuid().optional(),
});

export type CreateShareInput = z.infer<typeof createShareInputSchema>;
export type ShareResponse = z.infer<typeof shareResponseSchema>;
