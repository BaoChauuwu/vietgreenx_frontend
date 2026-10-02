"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import type { FeedPostCardProps } from "@/features/posts";
import { CreatePostComposer, FeedList, getPostsCopy } from "@/features/posts";
import { ProfilePhotosCard } from "./ProfilePhotosCard";
import {
  ProfileHeader,
  ProfileIntroCard,
  ProfileTransactionHistoryCard,
  FeedProfileBanner,
  getProfileCopy,
  useMyProfile,
} from "@/features/profile";
import { usePostBlockAuthor } from "@/features/block";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent } from "@/shared/ui/card";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { FarmTipsRail } from "@/shared/ui/workspace-rail-card";
import { ProfileWorkspaceRail } from "./ProfileRails";

interface ProfileScreenProps {
  locale?: AppLocale;
  PostCardComponent?: ComponentType<FeedPostCardProps>;
  PostTheaterComponent?: ComponentType<{
    postId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    locale?: AppLocale;
  }>;
}

export function ProfileScreen({
  locale = getClientLocale(),
  PostCardComponent,
  PostTheaterComponent,
}: ProfileScreenProps) {
  const viewCopy = getProfileCopy(locale).view;
  const { user } = useUser();
  const { data: profile, isLoading, isError } = useMyProfile();
  const { onBlockAuthor, blockDialog } = usePostBlockAuthor(locale);
  const [selectedPhotoPostId, setSelectedPhotoPostId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <ModulePageShell width="profile">
        <ElevatedCard>
          <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {viewCopy.loading}
          </CardContent>
        </ElevatedCard>
      </ModulePageShell>
    );
  }

  if (isError || !profile || !user) {
    return (
      <ModulePageShell width="profile">
        <ElevatedCard className="border border-dashed border-border">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {viewCopy.loadError}
          </CardContent>
        </ElevatedCard>
      </ModulePageShell>
    );
  }

  const displayName = profile.displayName || user.fullName;
  const aside = getPostsCopy(locale).aside;

  return (
    <ModulePageShell
      width="profile"
      rightRail={<ProfileWorkspaceRail locale={locale} />}
      mobileBelowCenter={<FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />}
    >
      <div className="lg:hidden">
        <FeedProfileBanner locale={locale} />
      </div>

      <ProfileHeader profile={profile} displayName={displayName} role={user.role} locale={locale} />

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-3.5">
        <aside className="order-2 min-w-0 lg:order-1">
          <div className="space-y-3 lg:sticky lg:top-[80px] lg:pt-1">
            <ProfileIntroCard profile={profile} locale={locale} />
            <ProfileTransactionHistoryCard userId={user.id} locale={locale} />
            <ProfilePhotosCard
              locale={locale}
              onPhotoClick={(postId) => setSelectedPhotoPostId(postId)}
            />
          </div>
        </aside>

        <div className="order-1 min-w-0 space-y-3 lg:order-2">
          <CreatePostComposer
            locale={locale}
            displayName={displayName}
            avatarUrl={profile.avatarUrl}
          />
          <FeedList
            locale={locale}
            source="mine"
            showSuggestions={false}
            PostCardComponent={PostCardComponent}
            onBlockAuthor={onBlockAuthor}
          />
        </div>
      </div>

      {selectedPhotoPostId && PostTheaterComponent ? (
        <PostTheaterComponent
          postId={selectedPhotoPostId}
          open={Boolean(selectedPhotoPostId)}
          onOpenChange={(open: boolean) => {
            if (!open) setSelectedPhotoPostId(null);
          }}
          locale={locale}
        />
      ) : null}

      {blockDialog}
    </ModulePageShell>
  );
}
