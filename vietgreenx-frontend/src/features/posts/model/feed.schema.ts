import { z } from "zod";

import { postSchema } from "@/entities/post";

export const feedModeSchema = z.enum(["discovery", "following"]);

export const feedResponseSchema = z.object({
  items: z.array(postSchema),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
  limit: z.number().int().positive(),
});

export type FeedMode = z.infer<typeof feedModeSchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;

export type FeedCategory =
  | "produce_story"
  | "crop_journal"
  | "farming_technique"
  | "market_price"
  | "trade_connection"
  | "ocop_vietgap_story";
