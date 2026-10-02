import { uploadMedia } from "@/entities/media";
import { postSchema, type Post, type PostContentCategory } from "@/entities/post";
import { createService } from "@/shared/api/create-service";
import type { CursorPaginatedResult } from "@/shared/api";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import { normalizePostTagsForRequest } from "../lib/post-tags";
import { hashtagSearchResponseSchema, type HashtagSearchResponse } from "../model/hashtag.schema";
import {
  createCreatePostInputSchema,
  createUpdatePostInputSchema,
  type CreatePostInput,
  type PostTagInput,
  type UpdatePostInput,
} from "../model/post-input.schema";

const http = createService("/posts");

export interface CreatePostWithImageInput {
  body?: string;
  category?: PostContentCategory;
  imageFile?: File;
  tags?: PostTagInput[];
}

export interface MyPostsParams {
  cursor?: string;
  limit?: number;
}

export const postService = {
  byId(id: string): Promise<Post> {
    return http.get<Post>(`/${id}`, undefined, { schema: postSchema });
  },

  me(params?: MyPostsParams): Promise<CursorPaginatedResult<Post>> {
    return http.getCursorPaginated("/me", postSchema, { params });
  },

  create(input: CreatePostInput): Promise<Post> {
    const parsed = createCreatePostInputSchema(getClientLocale()).parse(input);
    const payload = {
      ...parsed,
      ...(parsed.tags ? { tags: normalizePostTagsForRequest(parsed.tags) } : {}),
    };
    return http.post<Post>("", payload, { schema: postSchema });
  },

  async createWithOptionalImage(input: CreatePostWithImageInput): Promise<Post> {
    const body = input.body?.trim() || undefined;
    let mediaIds: string[] | undefined;

    if (input.imageFile) {
      const { mediaId } = await uploadMedia(input.imageFile, "post_image");
      mediaIds = [mediaId];
    }

    return this.create({
      body,
      category: input.category,
      mediaIds,
      tags: input.tags,
    });
  },

  update(id: string, input: UpdatePostInput): Promise<Post> {
    const parsed = createUpdatePostInputSchema(getClientLocale()).parse(input);
    const payload = {
      ...parsed,
      ...(parsed.tags ? { tags: normalizePostTagsForRequest(parsed.tags) } : {}),
    };
    return http.patch<Post>(`/${id}`, payload, { schema: postSchema });
  },

  remove(id: string): Promise<void> {
    return http.delete<void>(`/${id}`);
  },

  searchHashtags(query: string, limit = 10): Promise<HashtagSearchResponse> {
    return http.get<HashtagSearchResponse>(
      "/hashtags",
      { params: { q: query, limit } },
      { schema: hashtagSearchResponseSchema },
    );
  },
};
