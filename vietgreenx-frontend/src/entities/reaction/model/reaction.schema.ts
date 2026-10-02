import { z } from "zod";

export const REACTION_TYPES = ["like", "love", "helpful", "trust", "green"] as const;
export const REACTION_TARGET_TYPES = ["post", "comment"] as const;

export const reactionTypeSchema = z.enum(REACTION_TYPES);
export const reactionTargetTypeSchema = z.enum(REACTION_TARGET_TYPES);

export const reactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  targetId: z.string(),
  targetType: reactionTargetTypeSchema,
  reaction: reactionTypeSchema,
  createdAt: z.string(),
});

export const reactionInputSchema = z.object({
  targetId: z.string(),
  targetType: reactionTargetTypeSchema,
  type: z.string(),
});

export type ReactionType = z.infer<typeof reactionTypeSchema>;
export type ReactionTargetType = z.infer<typeof reactionTargetTypeSchema>;
export type Reaction = z.infer<typeof reactionSchema>;
export type ReactionInput = z.infer<typeof reactionInputSchema>;
