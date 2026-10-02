import { z } from "zod";
import { reactionTypeSchema } from "@/entities/reaction";

export const reactionListItemSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  reaction: reactionTypeSchema,
});

export type ReactionListItem = z.infer<typeof reactionListItemSchema>;
