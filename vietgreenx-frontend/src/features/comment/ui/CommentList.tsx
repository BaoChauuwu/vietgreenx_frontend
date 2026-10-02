"use client";

import { Loader2 } from "lucide-react";
import type { ComponentType } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";

import { useComments } from "../api/comment.queries";
import { getCommentCopy } from "../comment.constants";
import { CommentItem, type CommentItemBaseProps } from "./CommentItem";

interface CommentListProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  viewerDisplayName?: string;
  viewerAvatarUrl?: string | null;
  locale?: AppLocale;
  CommentItemComponent?: ComponentType<CommentItemBaseProps>;
}

export function CommentList({
  postId,
  postAuthorId,
  currentUserId,
  viewerDisplayName,
  viewerAvatarUrl,
  locale = getClientLocale(),
  CommentItemComponent = CommentItem,
}: CommentListProps) {
  const copy = getCommentCopy(locale);
  const query = useComments(postId);
  const comments = query.data?.pages.flatMap((page) => page.items) ?? [];

  if (query.isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label={copy.loading} />
      </div>
    );
  }

  if (query.isError) {
    return <p className="py-4 text-center text-sm text-muted-foreground">{copy.loadError}</p>;
  }

  if (comments.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">{copy.empty}</p>;
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id}>
            <CommentItemComponent
              comment={comment}
              postId={postId}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              viewerDisplayName={viewerDisplayName}
              viewerAvatarUrl={viewerAvatarUrl}
              locale={locale}
            />
          </li>
        ))}
      </ul>

      {query.hasNextPage ? (
        <div className="flex justify-center pt-2">
          {query.isFetchingNextPage ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            <Button type="button" variant="ghost" size="sm" onClick={() => void query.fetchNextPage()}>
              {copy.loadMore}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
