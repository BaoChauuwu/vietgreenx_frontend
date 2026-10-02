"use client";

import { CommentItem, type CommentItemBaseProps } from "@/features/comment";
import { useCommentReaction } from "@/features/reaction";
import type { ReactionType } from "@/entities/reaction";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

export function EngagementCommentItem({
  comment,
  postId,
  postAuthorId,
  currentUserId,
  viewerDisplayName,
  viewerAvatarUrl,
  locale = getClientLocale(),
  isReply,
}: CommentItemBaseProps) {
  const { isLiked, onReact, isPending } = useCommentReaction(
    comment.id,
    (comment.userReaction as ReactionType | null) ?? null,
    locale,
  );

  return (
    <CommentItem
      comment={comment}
      postId={postId}
      postAuthorId={postAuthorId}
      currentUserId={currentUserId}
      viewerDisplayName={viewerDisplayName}
      viewerAvatarUrl={viewerAvatarUrl}
      locale={locale}
      isReply={isReply}
      reaction={{ isLiked, onToggle: () => onReact("like"), isPending }}
      ReplyItemComponent={EngagementCommentItem}
    />
  );
}
