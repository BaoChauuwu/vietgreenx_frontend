import { z } from "zod";

import { paginatedListSchema } from "@/shared/lib/paginated-list.schema";

export const blockedUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});

export const blockSchema = z.object({
  id: z.string().uuid(),
  blockedUserId: z.string().uuid(),
  createdAt: z.string(),
  blockedUser: blockedUserSchema,
});

export const blockListSchema = paginatedListSchema(blockSchema);

export type Block = z.infer<typeof blockSchema>;
export type BlockList = z.infer<typeof blockListSchema>;
