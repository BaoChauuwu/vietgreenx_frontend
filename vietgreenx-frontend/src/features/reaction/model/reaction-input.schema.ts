import { z } from "zod";

import { reactionTargetTypeSchema, reactionTypeSchema } from "@/entities/reaction";

export const reactInputSchema = z.object({
  targetId: z.string().uuid(),
  targetType: reactionTargetTypeSchema,
  reaction: reactionTypeSchema,
});

export const unreactInputSchema = z.object({
  targetId: z.string().uuid(),
  targetType: reactionTargetTypeSchema,
});

export type ReactInput = z.infer<typeof reactInputSchema>;
export type UnreactInput = z.infer<typeof unreactInputSchema>;
