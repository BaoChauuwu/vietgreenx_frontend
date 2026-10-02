"use client";

import type { ReactionType } from "@/entities/reaction";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import { useTargetReaction } from "./use-target-reaction";

export function usePostReaction(
  postId: string,
  serverReactionCount: number,
  viewerReaction: ReactionType | null = null,
  locale: AppLocale = getClientLocale(),
) {
  const { currentReaction, isLiked, reactionCount, react, isPending } = useTargetReaction(
    postId,
    "post",
    {
      locale,
      initialCount: serverReactionCount,
      initialReaction: viewerReaction,
      trackCount: true,
    },
  );

  return {
    currentReaction,
    isLiked,
    reactionCount: reactionCount ?? serverReactionCount,
    react,
    isPending,
  };
}
