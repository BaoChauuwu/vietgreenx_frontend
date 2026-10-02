import { z } from "zod";

export const userSearchItemSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});

export const userSearchResponseSchema = z.object({
  items: z.array(userSearchItemSchema),
});

export type UserSearchItem = z.infer<typeof userSearchItemSchema>;
export type UserSearchResponse = z.infer<typeof userSearchResponseSchema>;
