import { postSchema, type Post } from "@/entities/post";
import { createService } from "@/shared/api/create-service";
import type { CursorPaginatedResult } from "@/shared/api/unwrap-response";

import type { FeedCategory, FeedMode } from "../model/feed.schema";

export type { FeedCategory, FeedMode };

export interface FeedParams {
  mode?: FeedMode;
  cursor?: string;
  limit?: number;
  category?: FeedCategory;
  q?: string;
}

const http = createService("/feed");

export const feedService = {
  list(params: FeedParams = {}): Promise<CursorPaginatedResult<Post>> {
    return http.getCursorPaginated("", postSchema, { params });
  },
};
