export const PRODUCT_PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";
export const PRODUCT_PHOTO_MAX = 9;
export const PRODUCT_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

const PHOTO_MIME_TYPES = PRODUCT_PHOTO_ACCEPT.split(",").map((value) => value.trim());

export interface ProductPhotoItem {
  mediaId: string;
  previewUrl?: string;
}

export function productPhotosFromIds(
  photoMediaIds: string[],
  photoMedias?: { id: string; cdnUrl: string }[],
): ProductPhotoItem[] {
  return photoMediaIds.map((mediaId) => {
    const media = photoMedias?.find((m) => m.id === mediaId);
    return { mediaId, previewUrl: media?.cdnUrl };
  });
}

export function isAllowedProductPhoto(file: File): boolean {
  return PHOTO_MIME_TYPES.includes(file.type);
}

export function isProductPhotoWithinLimit(file: File): boolean {
  return file.size <= PRODUCT_PHOTO_MAX_BYTES;
}
