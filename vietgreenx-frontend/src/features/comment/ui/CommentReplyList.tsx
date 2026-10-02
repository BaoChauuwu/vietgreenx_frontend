"use client";

import { Loader2 } from "lucide-react";
import type { ComponentType } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import { useComments } from "../api/comment.queries";
import { CommentItem, type CommentItemBaseProps } from "./CommentItem";

interface CommentReplyListProps {
  postId: string;
  parentCommentId: string;
  parentAuthorDisplayName?: string;
  postAuthorId: string;
  currentUserId?: string;
  viewerDisplayName?: string;
  viewerAvatarUrl?: string | null;
  locale?: AppLocale;
  CommentItemComponent?: ComponentType<CommentItemBaseProps>;
}

export function CommentReplyList({
  postId,
  parentCommentId,
  parentAuthorDisplayName,
  postAuthorId,
  currentUserId,
  viewerDisplayName,
  viewerAvatarUrl,
  locale = getClientLocale(),
  CommentItemComponent = CommentItem,
}: CommentReplyListProps) {
  const { data, isLoading } = useComments(postId, parentCommentId);
  const replies = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return (
      <div className="mt-3 flex justify-center py-2">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (replies.length === 0) return null;

  return (
    <ul className="mt-3 space-y-3">
      {replies.map((reply) => (
        <li key={reply.id}>
          <CommentItemComponent
            comment={reply}
            postId={postId}
            postAuthorId={postAuthorId}
            currentUserId={currentUserId}
            viewerDisplayName={viewerDisplayName}
            viewerAvatarUrl={viewerAvatarUrl}
            locale={locale}
            isReply
            parentAuthorDisplayName={parentAuthorDisplayName}
          />
        </li>
      ))}
    </ul>
  );
}
