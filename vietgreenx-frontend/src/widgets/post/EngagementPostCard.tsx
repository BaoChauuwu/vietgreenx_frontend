"use client";

import { useState } from "react";

import type { Post } from "@/entities/post";
import {
  usePostReaction,
  ReactionButton,
  ReactionBreakdownBubbles,
  ReactionListDialog,
} from "@/features/reaction";
import { ReportDialog } from "@/features/reports";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import { PostCard, type PostBlockAuthorInput, type PostReactionControl } from "@/features/posts";
import { PostDetailDialog } from "./PostDetailDialog";

import { PostTheaterDialog } from "./PostTheaterDialog";

export type EngagementPostCardProps = {
  post: Post;
  locale?: AppLocale;
  className?: string;
  onBlockAuthor?: (author: PostBlockAuthorInput) => void;
};

type OpenMode = "detail" | "theater" | null;

export function EngagementPostCard({
  post,
  locale = getClientLocale(),
  className,
  onBlockAuthor,
}: EngagementPostCardProps) {
  const [openMode, setOpenMode] = useState<OpenMode>(null);
  const [reactionListOpen, setReactionListOpen] = useState(false);
  const { currentReaction, isLiked, reactionCount, react, isPending } = usePostReaction(
    post.id,
    post.reactionCount,
    post.viewerReaction ?? null,
    locale,
  );

  const breakdown = post.reactionBreakdown;

  const reaction: PostReactionControl = {
    reactionCount,
    buttonSlot: (
      <ReactionButton
        currentReaction={currentReaction}
        isLiked={isLiked}
        isPending={isPending}
        locale={locale}
        onReact={react}
      />
    ),
    bubblesSlot: breakdown ? (
      <ReactionBreakdownBubbles
        breakdown={breakdown}
        totalCount={reactionCount}
        onClick={() => setReactionListOpen(true)}
      />
    ) : null,
  };

  return (
    <>
      <PostCard
        post={post}
        locale={locale}
        className={className}
        onBlockAuthor={onBlockAuthor}
        reaction={reaction}
        renderReportDialog={(props) => <ReportDialog {...props} />}
        onOpenDetail={() => setOpenMode("detail")}
        onOpenTheater={post.media?.length > 0 ? () => setOpenMode("theater") : undefined}
      />
      {reactionCount > 0 && (
        <ReactionListDialog
          targetId={post.id}
          open={reactionListOpen}
          onOpenChange={setReactionListOpen}
          breakdown={breakdown}
          totalCount={reactionCount}
          locale={locale}
        />
      )}
      <PostDetailDialog
        postId={post.id}
        open={openMode === "detail"}
        onOpenChange={(open) => setOpenMode(open ? "detail" : null)}
        locale={locale}
      />
      {post.media?.length > 0 && (
        <PostTheaterDialog
          postId={post.id}
          open={openMode === "theater"}
          onOpenChange={(open) => setOpenMode(open ? "theater" : null)}
          locale={locale}
        />
      )}
    </>
  );
}
