"use client";

import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import type { CommentList } from "@/entities/comment";
import type { CreateCommentInput, UpdateCommentInput } from "../model/comment-input.schema";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { postKeys } from "@/shared/lib/post-query-keys";

import { getCommentCopy } from "../comment.constants";
import { commentService } from "./comment.service";

const COMMENT_PAGE_SIZE = 20;

export const commentKeys = {
  all: ["comments"] as const,
  list: (postId: string, parentCommentId?: string) =>
    [...commentKeys.all, "list", postId, parentCommentId ?? "root"] as const,
};

function invalidateCommentLists(qc: ReturnType<typeof useQueryClient>, postId: string, parentCommentId?: string) {
  void qc.invalidateQueries({ queryKey: commentKeys.list(postId) });
  if (parentCommentId) {
    void qc.invalidateQueries({ queryKey: commentKeys.list(postId, parentCommentId) });
  }
  void qc.invalidateQueries({ queryKey: postKeys.detail(postId) });
  void qc.invalidateQueries({ queryKey: postKeys.all });
}

export function useComments(postId: string, parentCommentId?: string, enabled = true) {
  return useInfiniteQuery<
    CommentList,
    Error,
    InfiniteData<CommentList>,
    ReturnType<typeof commentKeys.list>,
    string | undefined
  >({
    queryKey: commentKeys.list(postId, parentCommentId),
    queryFn: ({ pageParam }) =>
      commentService.list({
        postId,
        parentCommentId,
        cursor: pageParam,
        limit: COMMENT_PAGE_SIZE,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: Boolean(postId) && enabled,
    staleTime: 15_000,
  });
}

export function useCreateComment() {
  const qc = useQueryClient();
  const copy = getCommentCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (input: CreateCommentInput) => commentService.create(input),
    onSuccess: (_, input) => {
      toastService.success(copy.created);
      invalidateCommentLists(qc, input.postId, input.parentCommentId);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "";
      toastService.error(message.includes("reply") ? copy.replyError : copy.error);
    },
  });
}

export function useUpdateComment(postId: string) {
  const qc = useQueryClient();
  const copy = getCommentCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCommentInput["body"] }) =>
      commentService.update(id, { body }),
    onSuccess: (comment) => {
      toastService.success(copy.updated);
      invalidateCommentLists(qc, postId, comment.parentCommentId ?? undefined);
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useDeleteComment(postId: string) {
  const qc = useQueryClient();
  const copy = getCommentCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (id: string) => commentService.remove(id),
    onSuccess: () => {
      toastService.success(copy.deleted);
      invalidateCommentLists(qc, postId);
    },
    onError: () => toastService.error(copy.error),
  });
}
