"use client";

import { Image as ImageIcon } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { getProfileCopy } from "@/features/profile/profile.constants";
import { useMyPosts } from "@/features/posts";

interface ProfilePhotosCardProps {
  locale?: AppLocale;
  onPhotoClick?: (postId: string) => void;
}

export function ProfilePhotosCard({
  locale = getClientLocale(),
  onPhotoClick,
}: ProfilePhotosCardProps) {
  const { screen: copy } = getProfileCopy(locale);
  const { data, isLoading } = useMyPosts();

  // Extract photos from posts
  const photos =
    data?.pages
      .flatMap((page) => page.data)
      .flatMap((post) =>
        post.media
          .filter((media) => media.mimeType.startsWith("image/"))
          .map((media) => ({ ...media, postId: post.id })),
      ) ?? [];

  if (isLoading) {
    return (
      <ElevatedCard className="flex flex-col rounded-xl border-none shadow-sm">
        <CardHeader className="flex-row items-center justify-between px-5 pb-3 pt-5">
          <h3 className="text-base font-bold text-foreground">{copy.photosTitle}</h3>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center px-5 py-6 pb-5 text-muted-foreground">
          <div className="h-40 w-full animate-pulse rounded-md bg-muted" />
        </CardContent>
      </ElevatedCard>
    );
  }

  if (photos.length === 0) {
    return (
      <ElevatedCard className="flex flex-col rounded-xl border-none shadow-sm">
        <CardHeader className="flex-row items-center justify-between px-5 pb-3 pt-5">
          <h3 className="text-base font-bold text-foreground">{copy.photosTitle}</h3>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center px-5 py-6 pb-5 text-muted-foreground">
          <ImageIcon className="mb-2 size-8 opacity-20" />
          <p className="text-sm">{copy.noPhotos}</p>
        </CardContent>
      </ElevatedCard>
    );
  }

  // Display up to 9 photos for the 3x3 grid layout
  const displayPhotos = photos.slice(0, 9);

  return (
    <ElevatedCard className="flex flex-col rounded-xl border-none shadow-sm">
      <CardHeader className="flex-row items-center justify-between px-5 pb-3 pt-5">
        <h3 className="text-base font-bold text-foreground">{copy.photosTitle}</h3>
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-5">
        <div
          className={`grid gap-1 overflow-hidden rounded-xl ${
            displayPhotos.length === 1
              ? "grid-cols-1"
              : displayPhotos.length === 2 || displayPhotos.length === 4
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {displayPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => onPhotoClick?.(photo.postId)}
              className="group relative block aspect-square w-full overflow-hidden bg-muted text-left focus:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaUrl(photo.cdnUrl)}
                alt="Profile photo"
                className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </button>
          ))}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
