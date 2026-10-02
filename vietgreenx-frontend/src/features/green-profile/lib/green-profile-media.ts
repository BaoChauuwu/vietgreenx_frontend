import {
  GREEN_PROFILE_PHOTO_ACCEPT,
  GREEN_PROFILE_PHOTO_MAX_BYTES,
  GREEN_PROFILE_VIDEO_ACCEPT,
  GREEN_PROFILE_VIDEO_MAX_BYTES,
} from "../green-profile.constants";

const PHOTO_MIME_TYPES = GREEN_PROFILE_PHOTO_ACCEPT.split(",").map((value) => value.trim());
const VIDEO_MIME_TYPES = GREEN_PROFILE_VIDEO_ACCEPT.split(",").map((value) => value.trim());

export function isAllowedGreenProfilePhoto(file: File): boolean {
  return PHOTO_MIME_TYPES.includes(file.type);
}

export function isAllowedGreenProfileVideo(file: File): boolean {
  return VIDEO_MIME_TYPES.includes(file.type);
}

export function isGreenProfilePhotoWithinLimit(file: File): boolean {
  return file.size <= GREEN_PROFILE_PHOTO_MAX_BYTES;
}

export function isGreenProfileVideoWithinLimit(file: File): boolean {
  return file.size <= GREEN_PROFILE_VIDEO_MAX_BYTES;
}

export type GreenProfileMediaKind = "photo" | "video";

export interface GreenProfileMediaItem {
  mediaId: string;
  kind: GreenProfileMediaKind;
  mimeType: string;
  previewUrl?: string;
}

export function greenProfileMediaFromProfile(
  photoMedias?: { id: string; cdnUrl: string; mimeType: string }[],
  videoMedias?: { id: string; cdnUrl: string; mimeType: string }[],
): GreenProfileMediaItem[] {
  return [
    ...(photoMedias || []).map((media) => ({
      mediaId: media.id,
      kind: "photo" as const,
      mimeType: media.mimeType,
      previewUrl: media.cdnUrl,
    })),
    ...(videoMedias || []).map((media) => ({
      mediaId: media.id,
      kind: "video" as const,
      mimeType: media.mimeType,
      previewUrl: media.cdnUrl,
    })),
  ];
}

export function splitGreenProfileMediaItems(items: GreenProfileMediaItem[]): {
  photoMediaIds: string[];
  videoMediaIds: string[];
} {
  return {
    photoMediaIds: items.filter((item) => item.kind === "photo").map((item) => item.mediaId),
    videoMediaIds: items.filter((item) => item.kind === "video").map((item) => item.mediaId),
  };
}
