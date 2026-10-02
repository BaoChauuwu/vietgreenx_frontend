"use client";

import { PostDetailView } from "@/features/posts";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { usePostBlockAuthor } from "@/features/block";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { PostDetailRail } from "./PostRails";
import { PostTagProductsScope } from "./PostTagProductsScope";

import { EngagementPostCard } from "./EngagementPostCard";
import { PostDetailComments } from "./PostDetailComments";

interface PostDetailScreenProps {
  postId: string;
  locale?: AppLocale;
}

export function PostDetailScreen({ postId, locale = getClientLocale() }: PostDetailScreenProps) {
  const { onBlockAuthor, blockDialog } = usePostBlockAuthor(locale);

  return (
    <ModulePageShell
      width="feed"
      contentClassName="space-y-4"
      rightRail={<PostDetailRail locale={locale} />}
    >
      <PostTagProductsScope>
        <PostDetailView
          postId={postId}
          locale={locale}
          onBlockAuthor={onBlockAuthor}
          PostCardComponent={EngagementPostCard}
          hideBackButton
        />
        <PostDetailComments
          postId={postId}
          locale={locale}
          hideTitle
          composerPosition="bottom"
          className="shadow-xs -mt-4 rounded-t-none border-t-0"
        />
        {blockDialog}
      </PostTagProductsScope>
    </ModulePageShell>
  );
}
