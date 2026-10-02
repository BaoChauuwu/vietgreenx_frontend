"use client";

import { Heart } from "lucide-react";
import { useState, type ComponentType } from "react";

import type { Comment } from "@/entities/comment";
import { getInitials } from "@/entities/user";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { formatRelativeTime, toIntlLocale } from "@/shared/lib/format-relative-time";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { cn } from "@/shared/lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";

import { getCommentCopy } from "../comment.constants";

function renderCommentBody(body: string, mentionName?: string) {
  const tag = mentionName ? `@${mentionName}` : null;
  if (tag && body.startsWith(tag)) {
    const rest = body.slice(tag.length);
    return (
      <>
        <span className="font-semibold text-primary">{tag}</span>
        {rest}
      </>
    );
  }
  // Fallback: highlight first @token (single-word names)
  return body.split(/(@\S+)/g).map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="font-semibold text-primary">{part}</span>
    ) : part,
  );
}
import { CommentComposer } from "./CommentComposer";
import { CommentReplyList } from "./CommentReplyList";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { EditCommentDialog } from "./EditCommentDialog";

export interface CommentReactionControl {
  isLiked: boolean;
  onToggle: () => void;
  isPending?: boolean;
}

export interface CommentItemBaseProps {
  comment: Comment;
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  viewerDisplayName?: string;
  viewerAvatarUrl?: string | null;
  locale?: AppLocale;
  isReply?: boolean;
  parentAuthorDisplayName?: string;
  reaction?: CommentReactionControl;
}

export type CommentItemProps = CommentItemBaseProps & {
  ReplyItemComponent?: ComponentType<CommentItemBaseProps>;
};

export function CommentItem({
  comment,
  postId,
  postAuthorId,
  currentUserId,
  viewerDisplayName,
  viewerAvatarUrl,
  locale = getClientLocale(),
  isReply = false,
  parentAuthorDisplayName,
  reaction,
  ReplyItemComponent,
}: CommentItemProps) {
  const copy = getCommentCopy(locale);
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isAuthor = currentUserId === comment.author.userId;
  const isPostOwner = currentUserId === postAuthorId;
  const canEdit = isAuthor;
  const canDelete = isAuthor || isPostOwner;
  const canReply = Boolean(currentUserId);
  const canLike = Boolean(currentUserId && reaction);

  // When replying to a reply, use the root parent so BE can flatten correctly
  const replyParentId = isReply ? (comment.parentCommentId ?? comment.id) : comment.id;

  // Derive mention: flattened reply uses replyToAuthor from BE; direct reply uses parent author passed from above
  const mentionName = comment.replyToAuthor?.displayName ?? (isReply ? parentAuthorDisplayName : undefined);

  const avatarSrc = resolveMediaUrl(comment.author.avatarUrl);
  const createdAt = new Date(comment.createdAt);

  return (
    <article className={cn("group", isReply ? "pl-11" : undefined)}>
      <div className="flex gap-3">
        <Avatar className="size-9 shrink-0">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={comment.author.displayName} /> : null}
          <AvatarFallback className="text-xs">
            {getInitials(comment.author.displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="w-fit max-w-full rounded-xl bg-muted/40 px-3 py-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold text-foreground">
                {comment.author.displayName}
              </span>
              <time
                dateTime={createdAt.toISOString()}
                className="text-xs text-muted-foreground"
                title={createdAt.toLocaleString(toIntlLocale(locale))}
              >
                {formatRelativeTime(createdAt, locale)}
              </time>
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
              {renderCommentBody(comment.body, mentionName)}
            </p>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 px-1">
            {canLike ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={reaction?.isPending}
                className={cn(
                  "h-7 gap-1 px-2 text-xs text-muted-foreground",
                  reaction?.isLiked && "text-primary",
                )}
                onClick={reaction?.onToggle}
              >
                <Heart className={cn("size-3.5", reaction?.isLiked && "fill-current")} />
                {copy.like}
              </Button>
            ) : null}
            {canReply ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={() => setReplyOpen((open) => !open)}
              >
                {copy.reply}
              </Button>
            ) : null}
            {canEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={() => setEditOpen(true)}
              >
                {copy.edit}
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                {copy.delete}
              </Button>
            ) : null}
          </div>

          {replyOpen && currentUserId ? (
            <div className="mt-3">
              <CommentComposer
                postId={postId}
                parentCommentId={replyParentId}
                replyToDisplayName={comment.author.displayName}
                displayName={viewerDisplayName}
                avatarUrl={viewerAvatarUrl}
                autoFocus
                compact
                locale={locale}
                onSuccess={() => setReplyOpen(false)}
              />
            </div>
          ) : null}

          {!isReply ? (
            <CommentReplyList
              postId={postId}
              parentCommentId={comment.id}
              parentAuthorDisplayName={comment.author.displayName}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              viewerDisplayName={viewerDisplayName}
              viewerAvatarUrl={viewerAvatarUrl}
              locale={locale}
              CommentItemComponent={ReplyItemComponent}
            />
          ) : null}
        </div>
      </div>

      <EditCommentDialog
        comment={comment}
        postId={postId}
        open={editOpen}
        onOpenChange={setEditOpen}
        locale={locale}
      />
      <DeleteCommentDialog
        commentId={comment.id}
        postId={postId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        locale={locale}
      />
    </article>
  );
}
