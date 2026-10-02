"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ComponentType } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { toNormalizedApiError } from "@/shared/api/api";

import { usePostById } from "../api/post.queries";
import { getPostsCopy } from "../posts.constants";
import { FeedPostSkeleton } from "./FeedPostSkeleton";
import { PostCard, type PostBlockAuthorInput, type FeedPostCardProps } from "./PostCard";

interface PostDetailViewProps {
  postId: string;
  locale?: AppLocale;
  onBlockAuthor?: (author: PostBlockAuthorInput) => void;
  PostCardComponent?: ComponentType<FeedPostCardProps>;
  hideBackButton?: boolean;
}

export function PostDetailView({
  postId,
  locale = getClientLocale(),
  onBlockAuthor,
  PostCardComponent = PostCard,
  hideBackButton = false,
}: PostDetailViewProps) {
  const copy = getPostsCopy(locale).detail;
  const { data: post, isLoading, isError, error } = usePostById(postId);
  const forbidden = isError && toNormalizedApiError(error).status === 403;

  if (isLoading) {
    return <FeedPostSkeleton />;
  }

  if (isError || !post) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5 text-muted-foreground">
          <Link href={ROUTES.feed}>
            <ArrowLeft className="size-4" />
            {copy.backToFeed}
          </Link>
        </Button>
        <ElevatedCard>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {forbidden ? copy.forbidden : isError ? copy.loadError : copy.notFound}
          </CardContent>
        </ElevatedCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!hideBackButton && (
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5 text-muted-foreground">
          <Link href={ROUTES.feed}>
            <ArrowLeft className="size-4" />
            {copy.backToFeed}
          </Link>
        </Button>
      )}
      <PostCardComponent post={post} locale={locale} onBlockAuthor={onBlockAuthor} />
    </div>
  );
}
