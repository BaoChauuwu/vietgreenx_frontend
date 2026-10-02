import { z } from "zod";

// BE CreateShareRequestDto uses "caption" (not "comment")
export const shareInputSchema = z.object({
  postId: z.string().min(1),
  caption: z.string().max(500).optional(),
});

// BE ShareResponseDto uses "userId" (not "sharerId")
export const shareSchema = z.object({
  id: z.string(),
  postId: z.string(),
  userId: z.string(),
  createdAt: z.string(),
});

export type ShareInput = z.infer<typeof shareInputSchema>;
export type Share = z.infer<typeof shareSchema>;
