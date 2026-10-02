"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef } from "react";

import { uploadMedia, type UploadedMedia } from "@/entities/media";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { toastService } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";

import { getProductsCopy } from "../products.constants";
import {
  isAllowedProductPhoto,
  isProductPhotoWithinLimit,
  PRODUCT_PHOTO_ACCEPT,
  PRODUCT_PHOTO_MAX,
  type ProductPhotoItem,
} from "../lib/product-photos";

interface ProductPhotoFieldsProps {
  locale?: AppLocale;
  items: ProductPhotoItem[];
  onChange: (items: ProductPhotoItem[]) => void;
  disabled?: boolean;
}

export function ProductPhotoFields({
  locale = getClientLocale(),
  items,
  onChange,
  disabled = false,
}: ProductPhotoFieldsProps) {
  const copy = getProductsCopy(locale).form.photos;
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadFile, isPending: isUploading } = useSingleFlightMutation<
    UploadedMedia, Error, File
  >({
    mutationFn: (file) => uploadMedia(file, "product_image"),
    onError: () => toastService.error(copy.uploadError),
  });

  const handleUpload = async (file: File) => {
    if (!isAllowedProductPhoto(file)) {
      toastService.error(copy.invalidType);
      return;
    }
    if (!isProductPhotoWithinLimit(file)) {
      toastService.error(copy.tooLarge);
      return;
    }
    if (items.length >= PRODUCT_PHOTO_MAX) {
      toastService.error(copy.limit);
      return;
    }

    const uploaded = await uploadFile(file);
    if (!uploaded) return;
    onChange([
      ...items,
      { mediaId: uploaded.mediaId, previewUrl: uploaded.cdnUrl || undefined },
    ]);
  };

  return (
    <div className="space-y-2">
      <Label>{copy.label}</Label>
      <p className="text-xs text-muted-foreground">{copy.hint}</p>
      {items.length ? (
        <ul className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li
              key={item.mediaId}
              className="relative size-20 overflow-hidden rounded-lg border border-border bg-muted/30"
            >
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveMediaUrl(item.previewUrl)}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                  {copy.photoFallback} {index + 1}
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0.5 top-0.5 size-7 bg-background/80 text-destructive hover:text-destructive"
                disabled={disabled || isUploading}
                onClick={() => onChange(items.filter((photo) => photo.mediaId !== item.mediaId))}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept={PRODUCT_PHOTO_ACCEPT}
        className="sr-only"
        disabled={disabled || isUploading || items.length >= PRODUCT_PHOTO_MAX}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleUpload(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        disabled={disabled || isUploading || items.length >= PRODUCT_PHOTO_MAX}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : (
          <ImagePlus className="size-3.5" />
        )}
        {copy.add}
      </Button>
    </div>
  );
}
