import { createService } from "@/shared/api/create-service";

import {
  commentListSchema,
  commentSchema,
  type Comment,
  type CommentList,
} from "@/entities/comment";
import type {
  CreateCommentInput,
  ListCommentsParams,
  UpdateCommentInput,
} from "../model/comment-input.schema";

const http = createService("/comments");

export const commentService = {
  list(params: ListCommentsParams): Promise<CommentList> {
    const { postId, parentCommentId, cursor, limit = 20 } = params;
    return http.get<CommentList>(
      "",
      {
        params: {
          postId,
          ...(parentCommentId ? { parentCommentId } : {}),
          ...(cursor ? { cursor } : {}),
          limit,
        },
      },
      { schema: commentListSchema },
    );
  },

  create(input: CreateCommentInput): Promise<Comment> {
    return http.post<Comment>("", input, { schema: commentSchema });
  },

  update(id: string, input: UpdateCommentInput): Promise<Comment> {
    return http.patch<Comment>(`/${id}`, input, { schema: commentSchema });
  },

  // BE returns void on delete — no schema needed
  remove(id: string): Promise<void> {
    return http.delete<void>(`/${id}`);
  },
};
