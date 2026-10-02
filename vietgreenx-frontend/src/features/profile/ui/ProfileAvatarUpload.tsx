"use client";

import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getInitials } from "@/entities/user";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toastService } from "@/shared/lib/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { useUploadAvatar } from "../api/profile.queries";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { AVATAR_ACCEPT, AVATAR_MAX_BYTES, isAllowedAvatarFile } from "../model/profile-edit.schema";
import { getProfileCopy } from "../profile.constants";

interface ProfileAvatarUploadProps {
  displayName: string;
  avatarUrl?: string | null;
  locale?: AppLocale;
}

export function ProfileAvatarUpload({
  displayName,
  avatarUrl,
  locale = getClientLocale(),
}: ProfileAvatarUploadProps) {
  const copy = getProfileCopy(locale).edit;
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const { mutate: upload, isPending } = useUploadAvatar();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isAllowedAvatarFile(file)) {
      toastService.error(copy.avatarInvalidType);
      return;
    }

    if (file.size > AVATAR_MAX_BYTES) {
      toastService.error(copy.avatarTooLarge);
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextPreview;
    });

    upload(file, {
      onSuccess: () => toastService.success(copy.avatarSaved),
      onError: () => {
        toastService.error(copy.avatarSaveError);
        setPreviewUrl(undefined);
      },
    });
  };

  const resolvedAvatar = previewUrl ?? resolveMediaUrl(avatarUrl);

  return (
    <ElevatedCard className="bg-muted/20">
      <CardContent className="flex items-center gap-4 p-4">
      <Avatar className="size-20 ring-2 ring-background">
        {resolvedAvatar && <AvatarImage src={resolvedAvatar} alt={displayName} />}
        <AvatarFallback className="bg-primary/10 text-lg text-primary">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
          {isPending ? copy.avatarUploading : copy.changeAvatar}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">{copy.avatarHint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={AVATAR_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      </CardContent>
    </ElevatedCard>
  );
}
