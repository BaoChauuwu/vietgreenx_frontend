import { mediaService } from "../api/media.service";
import type { MediaPurpose, UploadedMedia } from "../model/media.schema";

export async function uploadMedia(file: File, purpose: MediaPurpose): Promise<UploadedMedia> {
  const uploadTarget = await mediaService.createUploadUrl({
    purpose,
    fileName: file.name,
    mimeType: file.type,
    fileSize: file.size,
  });

  if (uploadTarget.uploadMethod === "PUT") {
    await mediaService.putToPresignedUrl(uploadTarget.uploadUrl, file, uploadTarget.mimeType);
    const completed = await mediaService.completeUpload(uploadTarget.mediaId);
    return toUploadedMedia(completed);
  }

  const completed = await mediaService.uploadLocalFile(
    uploadTarget.mediaId,
    file,
    uploadTarget.uploadUrl,
    uploadTarget.uploadField ?? "file",
  );
  return toUploadedMedia(completed);
}

export async function uploadMediaBatch(
  files: File[],
  purpose: MediaPurpose,
): Promise<UploadedMedia[]> {
  return Promise.all(files.map((file) => uploadMedia(file, purpose)));
}

function toUploadedMedia(completed: {
  id: string;
  cdnUrl: string;
  mimeType: string;
}): UploadedMedia {
  return {
    mediaId: completed.id,
    cdnUrl: completed.cdnUrl,
    mimeType: completed.mimeType,
  };
}
