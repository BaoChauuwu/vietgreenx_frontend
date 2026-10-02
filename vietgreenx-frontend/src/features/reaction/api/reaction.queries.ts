"use client";

import { useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";

import type { ReactInput, UnreactInput } from "../model/reaction-input.schema";
import type { ReactionType } from "@/entities/reaction";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { postKeys } from "@/shared/lib/post-query-keys";
import { getReactionCopy } from "../reaction.constants";
import { reactionService } from "./reaction.service";
import type { CursorPaginatedResult } from "@/shared/api";
import type { Post } from "@/entities/post";

export const reactionKeys = {
  all: ["reactions"] as const,
  viewer: (targetId: string, targetType: string) =>
    [...reactionKeys.all, "viewer", targetType, targetId] as const,
  list: (targetId: string, targetType: string, reaction?: string) =>
    [...reactionKeys.all, "list", targetType, targetId, reaction ?? "all"] as const,
};

type FeedCache = InfiniteData<CursorPaginatedResult<Post>>;

function patchViewerReaction(
  qc: ReturnType<typeof useQueryClient>,
  postId: string,
  reactionType: ReactionType | null,
) {
  const reacted = reactionType !== null;

  const patch = (old: FeedCache | undefined): FeedCache | undefined => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.map((post) => {
          if (post.id !== postId) return post;

          const wasReacted = post.viewerHasReacted ?? false;
          const prevType = post.viewerReaction ?? null;

          // Patch reactionBreakdown optimistically
          const bd = { ...(post.reactionBreakdown ?? {}) };
          if (prevType && prevType !== reactionType) {
            // Remove old type
            const prev = (bd[prevType] ?? 1) - 1;
            if (prev <= 0) delete bd[prevType]; else bd[prevType] = prev;
          }
          if (reactionType) {
            bd[reactionType] = (bd[reactionType] ?? 0) + (prevType === reactionType ? 0 : 1);
          }

          return {
            ...post,
            viewerHasReacted: reacted,
            viewerReaction: reactionType,
            reactionBreakdown: bd,
            reactionCount:
              reacted === wasReacted
                ? post.reactionCount
                : reacted
                  ? post.reactionCount + 1
                  : Math.max(0, post.reactionCount - 1),
          };
        }),
      })),
    };
  };

  // Update all feed + mine caches. Exclude detail queries (single Post, not InfiniteData).
  qc.setQueriesData<FeedCache>(
    {
      predicate: (query) => {
        const key = query.queryKey as readonly unknown[];
        return key[0] === "posts" && key[1] !== "detail";
      },
    },
    patch,
  );

  void qc.invalidateQueries({ queryKey: postKeys.detail(postId) });
}

export function useReact() {
  const qc = useQueryClient();
  const copy = getReactionCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (input: ReactInput) => reactionService.react(input),
    onSuccess: (_, input) => {
      if (input.targetType === "post") {
        patchViewerReaction(qc, input.targetId, input.reaction);
      }
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useReactionList(
  targetId: string,
  targetType: "post" | "comment",
  reactionFilter: ReactionType | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: reactionKeys.list(targetId, targetType, reactionFilter),
    queryFn: () =>
      reactionService.list({ targetId, targetType, reaction: reactionFilter, page: 1, limit: 50 }),
    enabled,
    staleTime: 30_000,
  });
}

export function useUnreact() {
  const qc = useQueryClient();
  const copy = getReactionCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (input: UnreactInput) => reactionService.unreact(input),
    onSuccess: (_, input) => {
      if (input.targetType === "post") {
        patchViewerReaction(qc, input.targetId, null);
      }
    },
    onError: () => toastService.error(copy.error),
  });
}
