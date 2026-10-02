import { z } from "zod";

export const commentAuthorSchema = z.preprocess(
  (value) => {
    if (!value || typeof value !== "object") return value;
    const record = value as Record<string, unknown>;
    if (!record.userId && typeof record.id === "string") {
      return { ...record, userId: record.id };
    }
    return value;
  },
  z.object({
    userId: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
  }),
);

export const commentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  parentCommentId: z.string().uuid().nullable().optional(),
  replyToCommentId: z.string().uuid().nullable().optional(),
  replyToAuthor: commentAuthorSchema.nullable().optional(),
  body: z.string(),
  author: commentAuthorSchema,
  reactionCount: z.number().int().nonnegative().default(0),
  userReaction: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

const commentListResponseSchema = z.object({
  items: z.array(commentSchema).optional(),
  data: z.array(commentSchema).optional(),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
  limit: z.number().int().positive(),
});

export const commentListSchema = commentListResponseSchema.transform((value) => ({
  items: value.items ?? value.data ?? [],
  nextCursor: value.nextCursor,
  hasNext: value.hasNext,
  limit: value.limit,
}));

export const createCommentInputSchema = z.object({
  postId: z.string(),
  body: z.string().min(1).max(2000),
});

export const updateCommentInputSchema = z.object({
  body: z.string().min(1).max(2000),
});

export type CommentAuthor = z.infer<typeof commentAuthorSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CommentList = z.output<typeof commentListSchema>;
export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;
