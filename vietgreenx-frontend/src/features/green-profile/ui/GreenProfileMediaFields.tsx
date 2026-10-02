"use client";

import { ImagePlus, Loader2, Trash2, Video } from "lucide-react";
import { useRef, useState } from "react";

import { uploadMedia } from "@/entities/media";
import type { UploadedMedia } from "@/entities/media";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { toastService } from "@/shared/lib/toast";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { Button } from "@/shared/ui/button";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import {
  GREEN_PROFILE_PHOTO_ACCEPT,
  GREEN_PROFILE_PHOTO_MAX,
  GREEN_PROFILE_VIDEO_ACCEPT,
  GREEN_PROFILE_VIDEO_MAX,
  getGreenProfileCopy,
  getGreenProfileValidationCopy,
} from "../green-profile.constants";
import {
  type GreenProfileMediaItem,
  isAllowedGreenProfilePhoto,
  isAllowedGreenProfileVideo,
  isGreenProfilePhotoWithinLimit,
  isGreenProfileVideoWithinLimit,
} from "../lib/green-profile-media";

interface GreenProfileMediaFieldsProps {
  locale?: AppLocale;
  items: GreenProfileMediaItem[];
  onChange: (items: GreenProfileMediaItem[]) => void;
  disabled?: boolean;
}

export function GreenProfileMediaFields({
  locale = getClientLocale(),
  items,
  onChange,
  disabled = false,
}: GreenProfileMediaFieldsProps) {
  const copy = getGreenProfileCopy(locale).form.media;
  const validation = getGreenProfileValidationCopy(locale);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingKind, setUploadingKind] = useState<"photo" | "video" | null>(null);

  const photos = items.filter((item) => item.kind === "photo");
  const videos = items.filter((item) => item.kind === "video");
  const isUploading = uploadingKind !== null;

  const { mutateAsync: uploadFile } = useSingleFlightMutation<
    UploadedMedia,
    Error,
    { file: File; kind: "photo" | "video" }
  >({
    mutationFn: ({ file, kind }) => {
      const purpose = kind === "photo" ? "green_profile_photo" : "green_profile_video";
      return uploadMedia(file, purpose);
    },
    onError: () => toastService.error(copy.uploadError),
  });

  const handleUpload = async (file: File, kind: "photo" | "video") => {
    if (kind === "photo") {
      if (!isAllowedGreenProfilePhoto(file)) {
        toastService.error(validation.photoInvalidType);
        return;
      }
      if (!isGreenProfilePhotoWithinLimit(file)) {
        toastService.error(validation.photoTooLarge);
        return;
      }
      if (photos.length >= GREEN_PROFILE_PHOTO_MAX) {
        toastService.error(validation.photoLimit);
        return;
      }
    } else {
      if (!isAllowedGreenProfileVideo(file)) {
        toastService.error(validation.videoInvalidType);
        return;
      }
      if (!isGreenProfileVideoWithinLimit(file)) {
        toastService.error(validation.videoTooLarge);
        return;
      }
      if (videos.length >= GREEN_PROFILE_VIDEO_MAX) {
        toastService.error(validation.videoLimit);
        return;
      }
    }

    setUploadingKind(kind);
    try {
      const uploaded = await uploadFile({ file, kind });
      if (!uploaded) return;
      onChange([
        ...items,
        {
          mediaId: uploaded.mediaId,
          kind,
          mimeType: uploaded.mimeType,
          previewUrl: resolveMediaUrl(uploaded.cdnUrl),
        },
      ]);
    } finally {
      setUploadingKind(null);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void handleUpload(file, "photo");
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void handleUpload(file, "video");
  };

  const removeItem = (mediaId: string) => {
    onChange(items.filter((item) => item.mediaId !== mediaId));
  };

  return (
    <ElevatedCard className="overflow-hidden border-none shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
            <ImagePlus className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">{copy.photosTitle}</h2>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">{copy.photoHint}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pt-6">
        <div className="flex flex-wrap gap-3">
          {photos.map((item) => (
            <MediaTile
              key={item.mediaId}
              item={item}
              removeLabel={copy.remove}
              savedLabel={copy.savedMedia}
              disabled={disabled || isUploading}
              onRemove={() => removeItem(item.mediaId)}
            />
          ))}
          {photos.length < GREEN_PROFILE_PHOTO_MAX ? (
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => photoInputRef.current?.click()}
              className={cn(
                "flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border",
                "text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {uploadingKind === "photo" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-5" />
              )}
              {uploadingKind === "photo" ? copy.uploading : copy.addPhoto}
            </button>
          ) : null}
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{copy.videosTitle}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{copy.videoHint}</p>
          </div>
          <div className="space-y-2">
            {videos.map((item) => (
              <div
                key={item.mediaId}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Video className="size-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.previewUrl ? item.mimeType : copy.savedMedia}
                    </p>
                    {item.previewUrl ? (
                      <a
                        href={item.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {copy.viewVideo}
                      </a>
                    ) : null}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-destructive hover:text-destructive"
                  disabled={disabled || isUploading}
                  onClick={() => removeItem(item.mediaId)}
                >
                  <Trash2 className="size-4" />
                  {copy.remove}
                </Button>
              </div>
            ))}
            {videos.length < GREEN_PROFILE_VIDEO_MAX ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={disabled || isUploading}
                onClick={() => videoInputRef.current?.click()}
              >
                {uploadingKind === "video" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Video className="size-4" />
                )}
                {uploadingKind === "video" ? copy.uploading : copy.addVideo}
              </Button>
            ) : null}
          </div>
        </div>

        <input
          ref={photoInputRef}
          type="file"
          accept={GREEN_PROFILE_PHOTO_ACCEPT}
          className="hidden"
          onChange={handlePhotoChange}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept={GREEN_PROFILE_VIDEO_ACCEPT}
          className="hidden"
          onChange={handleVideoChange}
        />
      </CardContent>
    </ElevatedCard>
  );
}

function MediaTile({
  item,
  removeLabel,
  savedLabel,
  disabled,
  onRemove,
}: {
  item: GreenProfileMediaItem;
  removeLabel: string;
  savedLabel: string;
  disabled: boolean;
  onRemove: () => void;
}) {
  const src = item.previewUrl;

  return (
    <div className="group relative size-24 overflow-hidden rounded-lg border border-border bg-muted">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1 px-2 text-center text-[10px] text-muted-foreground">
          <ImagePlus className="size-5 opacity-60" />
          <span>{savedLabel}</span>
        </div>
      )}
      <button
        type="button"
        aria-label={removeLabel}
        disabled={disabled}
        onClick={onRemove}
        className={cn(
          "absolute right-1 top-1 rounded-md bg-background/90 p-1 text-destructive shadow-sm",
          "opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
