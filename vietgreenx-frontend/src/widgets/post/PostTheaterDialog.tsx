"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import type { Post } from "@/entities/post";
import {
  usePostById,
  getPostsCopy,
  PostCard,
  type PostBlockAuthorInput,
  type PostReactionControl,
} from "@/features/posts";
import {
  usePostReaction,
  ReactionButton,
  ReactionBreakdownBubbles,
  ReactionListDialog,
} from "@/features/reaction";
import { CommentComposer, CommentList } from "@/features/comment";
import { useMyProfile } from "@/features/profile";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";

import { usePostBlockAuthor } from "@/features/block";
import { PostTagProductsScope } from "./PostTagProductsScope";
import { EngagementCommentItem } from "./EngagementCommentItem";

interface PostTheaterDialogProps {
  postId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function PostTheaterDialog({
  postId,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: PostTheaterDialogProps) {
  const { onBlockAuthor, blockDialog } = usePostBlockAuthor(locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[100dvh] w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 bg-black p-0 md:flex-row [&>button]:hidden">
        {postId && (
          <PostTagProductsScope>
            <PostTheaterDialogInner
              postId={postId}
              locale={locale}
              onBlockAuthor={onBlockAuthor}
              onClose={() => onOpenChange(false)}
            />
            {blockDialog}
          </PostTagProductsScope>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Inner ───────────────────────────────────────────────────────────────────

interface InnerProps {
  postId: string;
  locale: AppLocale;
  onBlockAuthor: (author: PostBlockAuthorInput) => void;
  onClose: () => void;
}

function PostTheaterDialogInner({ postId, locale, onBlockAuthor, onClose }: InnerProps) {
  const { detail: copy } = getPostsCopy(locale);
  const { data: post, isLoading } = usePostById(postId);
  const { data: profile } = useMyProfile();
  const { user } = useUser();

  const imageSrc = post?.media?.[0]?.cdnUrl ? resolveMediaUrl(post.media[0].cdnUrl) : null;

  return (
    <>
      {/* ── Left Column: Media (Dark Mode) ─────────────────────────────── */}
      <div className="relative flex min-h-[40vh] flex-1 items-center justify-center bg-black/95 md:min-h-0">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 focus:outline-none"
          aria-label={copy.close}
        >
          <X className="size-6" />
        </button>

        {isLoading ? (
          <Loader2 className="size-8 animate-spin text-white/50" />
        ) : imageSrc ? (
          <div className="relative h-full w-full">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 70vw"
              priority
            />
          </div>
        ) : null}
      </div>

      {/* ── Right Column: Content & Comments (Light Mode) ──────────────── */}
      <div className="flex h-[60vh] w-full shrink-0 flex-col bg-background md:h-full md:w-[400px] lg:w-[480px]">
        {/* Header (Desktop only, mobile already has X on image) */}
        <div className="hidden shrink-0 items-center justify-between border-b px-4 py-3 md:flex">
          <DialogTitle className="text-[15px] font-semibold leading-tight">
            {post ? copy.dialogTitle(post.author.displayName) : copy.dialogTitleFallback}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading || !post ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <PostCardInDialog post={post} locale={locale} onBlockAuthor={onBlockAuthor} />
              <div className="space-y-3 px-4 py-4">
                <CommentList
                  postId={postId}
                  postAuthorId={post.author.userId}
                  currentUserId={user?.id}
                  viewerDisplayName={profile?.displayName}
                  viewerAvatarUrl={profile?.avatarUrl}
                  locale={locale}
                  CommentItemComponent={EngagementCommentItem}
                />
              </div>
            </>
          )}
        </div>

        {/* Composer */}
        {user && (
          <div className="shrink-0 border-t bg-background px-4 py-3">
            <CommentComposer
              postId={postId}
              displayName={profile?.displayName}
              avatarUrl={profile?.avatarUrl}
              locale={locale}
              compact
            />
          </div>
        )}
      </div>
    </>
  );
}

// ─── PostCard wired with reactions ──────────────────────────────────────────

interface PostCardInDialogProps {
  post: Post;
  locale: AppLocale;
  onBlockAuthor: (author: PostBlockAuthorInput) => void;
}

function PostCardInDialog({ post, locale, onBlockAuthor }: PostCardInDialogProps) {
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
        onBlockAuthor={onBlockAuthor}
        reaction={reaction}
        className="rounded-none border-0 border-b shadow-none"
        hideMedia={true}
        onCommentClick={() => {
          const textarea = document.querySelector<HTMLTextAreaElement>("textarea");
          textarea?.focus();
        }}
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
    </>
  );
}
