"use client";

import type { ReactionType } from "@/entities/reaction";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import { useTargetReaction } from "./use-target-reaction";

export function useCommentReaction(
  commentId: string,
  initialReaction: ReactionType | null = null,
  locale: AppLocale = getClientLocale(),
) {
  const { currentReaction, isLiked, react, isPending } = useTargetReaction(commentId, "comment", {
    locale,
    initialReaction,
    trackCount: false,
  });

  return { currentReaction, isLiked, onReact: react, isPending };
}
