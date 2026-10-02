"use client";

import { useEffect, type ComponentType } from "react";

import { useUser } from "@/shared/auth";
import { cn } from "@/shared/lib/cn";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { getCommentCopy } from "../comment.constants";
import { CommentComposer } from "./CommentComposer";
import { CommentList } from "./CommentList";
import { CommentItem, type CommentItemBaseProps } from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  postAuthorId: string;
  locale?: AppLocale;
  CommentItemComponent?: ComponentType<CommentItemBaseProps>;
  /** Viewer display name — compose from `useMyProfile()` in widget layer. */
  viewerDisplayName?: string;
  viewerAvatarUrl?: string | null;
  /** Override the outer ElevatedCard className — use to flatten styling inside a Dialog. */
  className?: string;
  /** Compact composer (2 rows, no avatar) — for use inside a Dialog. */
  compact?: boolean;
  /** Hide the comment section header */
  hideTitle?: boolean;
  /** Position of the comment composer relative to comment list: "top" (default) or "bottom" */
  composerPosition?: "top" | "bottom";
}

export function CommentSection({
  postId,
  postAuthorId,
  locale = getClientLocale(),
  CommentItemComponent = CommentItem,
  viewerDisplayName,
  viewerAvatarUrl,
  className,
  compact,
  hideTitle = false,
  composerPosition = "top",
}: CommentSectionProps) {
  const copy = getCommentCopy(locale);
  const { user } = useUser();

  const displayName = viewerDisplayName ?? user?.fullName;
  const avatarUrl = viewerAvatarUrl ?? undefined;

  useEffect(() => {
    if (window.location.hash === "#comments") {
      document.getElementById("comments")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const composerNode = user ? (
    <CommentComposer
      postId={postId}
      displayName={displayName}
      avatarUrl={avatarUrl}
      locale={locale}
      compact={compact}
    />
  ) : null;

  const listNode = (
    <CommentList
      postId={postId}
      postAuthorId={postAuthorId}
      currentUserId={user?.id}
      viewerDisplayName={displayName}
      viewerAvatarUrl={avatarUrl}
      locale={locale}
      CommentItemComponent={CommentItemComponent}
    />
  );

  return (
    <ElevatedCard id="comments" className={cn("scroll-mt-20", className)}>
      <CardContent className="space-y-4 p-4 md:p-5">
        {!hideTitle && <h2 className="text-base font-semibold text-foreground">{copy.title}</h2>}

        {composerPosition === "bottom" ? (
          <>
            {listNode}
            {composerNode}
          </>
        ) : (
          <>
            {composerNode}
            {listNode}
          </>
        )}
      </CardContent>
    </ElevatedCard>
  );
}
