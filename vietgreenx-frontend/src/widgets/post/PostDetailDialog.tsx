"use client";

import { useState } from "react";
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
import { ReportDialog } from "@/features/reports";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/shared/ui/dialog";

import { usePostBlockAuthor } from "@/features/block";
import { PostTagProductsScope } from "./PostTagProductsScope";
import { PostTheaterDialog } from "./PostTheaterDialog";

import { EngagementCommentItem } from "./EngagementCommentItem";

interface PostDetailDialogProps {
  postId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function PostDetailDialog({
  postId,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: PostDetailDialogProps) {
  const { onBlockAuthor, blockDialog } = usePostBlockAuthor(locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
       * [&>button]:hidden — hide the default floating X from DialogContent;
       * we render our own X inside the header so title can be truly centered.
       */}
      <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-xl border-0 p-0 sm:w-full sm:max-w-2xl [&>button]:hidden">
        {postId && (
          <PostTagProductsScope>
            <PostDetailDialogInner postId={postId} locale={locale} onBlockAuthor={onBlockAuthor} />
            {blockDialog}
          </PostTagProductsScope>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Inner — fetches post, owns scrollable layout ────────────────────────────

interface InnerProps {
  postId: string;
  locale: AppLocale;
  onBlockAuthor: (author: PostBlockAuthorInput) => void;
}

function PostDetailDialogInner({ postId, locale, onBlockAuthor }: InnerProps) {
  const { detail: copy } = getPostsCopy(locale);
  const { data: post, isLoading } = usePostById(postId);
  const { data: profile } = useMyProfile();
  const { user } = useUser();

  return (
    <>
      {/* ── Fixed header ─────────────────────────────────────────────────── */}
      <div className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center border-b px-3 py-2">
        <div />
        <DialogTitle className="truncate text-center text-[15px] font-semibold leading-tight">
          {post ? copy.dialogTitle(post.author.displayName) : copy.dialogTitleFallback}
        </DialogTitle>
        <DialogClose className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <X className="size-5" />
          <span className="sr-only">{copy.close}</span>
        </DialogClose>
      </div>

      {/* ── Scrollable: post + comments ──────────────────────────────────── */}
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

      {/* ── Fixed composer ───────────────────────────────────────────────── */}
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
    </>
  );
}

// ─── PostCard wired with reactions — no onOpenDetail (already in dialog) ─────

interface PostCardInDialogProps {
  post: Post;
  locale: AppLocale;
  onBlockAuthor: (author: PostBlockAuthorInput) => void;
}

function PostCardInDialog({ post, locale, onBlockAuthor }: PostCardInDialogProps) {
  const [reactionListOpen, setReactionListOpen] = useState(false);
  const [theaterOpen, setTheaterOpen] = useState(false);
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
        className="rounded-none border-0 shadow-none"
        onBlockAuthor={onBlockAuthor}
        reaction={reaction}
        renderReportDialog={(props) => <ReportDialog {...props} />}
        onOpenTheater={post.media?.length > 0 ? () => setTheaterOpen(true) : undefined}
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
      {post.media?.length > 0 && (
        <PostTheaterDialog
          postId={post.id}
          open={theaterOpen}
          onOpenChange={setTheaterOpen}
          locale={locale}
        />
      )}
    </>
  );
}
