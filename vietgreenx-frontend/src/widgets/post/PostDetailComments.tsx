"use client";

import { CommentSection } from "@/features/comment";
import { usePostById } from "@/features/posts";
import { useMyProfile } from "@/features/profile";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import { EngagementCommentItem } from "./EngagementCommentItem";

interface PostDetailCommentsProps {
  postId: string;
  locale?: AppLocale;
  className?: string;
  compact?: boolean;
  hideTitle?: boolean;
  composerPosition?: "top" | "bottom";
}

export function PostDetailComments({
  postId,
  locale = getClientLocale(),
  className,
  compact,
  hideTitle,
  composerPosition,
}: PostDetailCommentsProps) {
  const { data: post, isLoading, isError } = usePostById(postId);
  const { data: profile } = useMyProfile();

  if (isLoading || isError || !post) return null;

  return (
    <CommentSection
      postId={post.id}
      postAuthorId={post.author.userId}
      locale={locale}
      CommentItemComponent={EngagementCommentItem}
      viewerDisplayName={profile?.displayName}
      viewerAvatarUrl={profile?.avatarUrl}
      className={className}
      compact={compact}
      hideTitle={hideTitle}
      composerPosition={composerPosition}
    />
  );
}
