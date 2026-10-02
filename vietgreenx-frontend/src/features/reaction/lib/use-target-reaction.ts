"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ReactionTargetType, ReactionType } from "@/entities/reaction";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toastService } from "@/shared/lib/toast";

import { useReact, useUnreact } from "../api/reaction.queries";
import { getReactionCopy } from "../reaction.constants";

interface UseTargetReactionOptions {
  locale?: AppLocale;
  initialCount?: number;
  initialReaction?: ReactionType | null;
  trackCount?: boolean;
}

export function useTargetReaction(
  targetId: string,
  targetType: ReactionTargetType,
  options: UseTargetReactionOptions = {},
) {
  const locale = options.locale ?? getClientLocale();
  const trackCount = options.trackCount ?? targetType === "post";
  const copy = getReactionCopy(locale);
  const { user } = useUser();
  const reactMutation = useReact();
  const unreactMutation = useUnreact();
  const hasInteracted = useRef(false);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(
    options.initialReaction ?? null,
  );
  const [reactionCount, setReactionCount] = useState(options.initialCount ?? 0);

  useEffect(() => {
    if (!hasInteracted.current && options.initialReaction !== undefined) {
      setCurrentReaction(options.initialReaction ?? null);
    }
  }, [options.initialReaction]);

  useEffect(() => {
    if (trackCount && options.initialCount !== undefined) {
      setReactionCount(options.initialCount);
    }
  }, [trackCount, options.initialCount]);

  const react = useCallback(
    (type: ReactionType) => {
      if (!user) {
        toastService.info(copy.loginRequired);
        return;
      }

      hasInteracted.current = true;
      const prev = currentReaction;
      const wasReacted = prev !== null;

      if (prev === type) {
        // Same reaction — toggle off
        setCurrentReaction(null);
        if (trackCount && wasReacted) {
          setReactionCount((c) => Math.max(0, c - 1));
        }
        unreactMutation.mutate(
          { targetId, targetType },
          {
            onError: () => {
              setCurrentReaction(prev);
              if (trackCount && wasReacted) {
                setReactionCount((c) => c + 1);
              }
            },
          },
        );
        return;
      }

      // New or changed reaction
      setCurrentReaction(type);
      if (trackCount && !wasReacted) {
        setReactionCount((c) => c + 1);
      }
      reactMutation.mutate(
        { targetId, targetType, reaction: type },
        {
          onError: () => {
            setCurrentReaction(prev);
            if (trackCount && !wasReacted) {
              setReactionCount((c) => Math.max(0, c - 1));
            }
          },
        },
      );
    },
    [copy.loginRequired, currentReaction, reactMutation, targetId, targetType, trackCount, unreactMutation, user],
  );

  return {
    currentReaction,
    isLiked: currentReaction !== null,
    reactionCount: trackCount ? reactionCount : undefined,
    react,
    isPending: reactMutation.isPending || unreactMutation.isPending,
  };
}
