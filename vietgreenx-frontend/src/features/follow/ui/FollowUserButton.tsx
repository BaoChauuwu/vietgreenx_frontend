"use client";

import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useState } from "react";

import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

import { useFollowUser, useUnfollowUser } from "../api/follow.queries";
import { getFollowCopy } from "../follow.constants";

type FollowUiState = "idle" | "active" | "pending";

interface FollowUserButtonProps {
  userId: string;
  locale?: AppLocale;
  size?: "sm" | "default";
  className?: string;
}

export function FollowUserButton({
  userId,
  locale = getClientLocale(),
  size = "sm",
  className,
}: FollowUserButtonProps) {
  const copy = getFollowCopy(locale);
  const { user } = useUser();
  const follow = useFollowUser(user?.id);
  const unfollow = useUnfollowUser(user?.id);
  const [state, setState] = useState<FollowUiState>("idle");

  if (!user || user.id === userId) return null;

  const isPending = follow.isPending || unfollow.isPending;
  const isFollowing = state === "active" || state === "pending";

  const handleClick = () => {
    if (isPending) return;

    if (isFollowing) {
      unfollow.mutate(userId, {
        onSuccess: () => setState("idle"),
      });
      return;
    }

    follow.mutate(userId, {
      onSuccess: (response) => {
        setState(response.status === "pending" ? "pending" : "active");
      },
    });
  };

  const label =
    state === "pending" ? copy.pending : state === "active" ? copy.following : copy.follow;

  return (
    <Button
      type="button"
      variant={isFollowing ? "outline" : "default"}
      size={size}
      className={cn("gap-1.5", className)}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : isFollowing ? (
        <UserMinus className="size-4" aria-hidden />
      ) : (
        <UserPlus className="size-4" aria-hidden />
      )}
      {label}
    </Button>
  );
}
