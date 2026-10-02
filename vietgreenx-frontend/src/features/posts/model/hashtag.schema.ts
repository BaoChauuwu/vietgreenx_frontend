import { z } from "zod";

export const hashtagSearchItemSchema = z.object({
  tag: z.string(),
  postCount: z.number().int().nonnegative(),
});

export const hashtagSearchResponseSchema = z.object({
  items: z.array(hashtagSearchItemSchema),
});

export type HashtagSearchItem = z.infer<typeof hashtagSearchItemSchema>;
export type HashtagSearchResponse = z.infer<typeof hashtagSearchResponseSchema>;

export const POST_HASHTAG_MAX_PER_POST = 30;
