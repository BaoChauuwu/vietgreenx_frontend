import { createService } from "@/shared/api/create-service";
import { getAccessToken } from "@/shared/auth/token-storage";
import { resolveBackendUrl } from "@/shared/api/resolve-backend-url";

import {
  createUploadUrlInputSchema,
  mediaCompleteResponseSchema,
  uploadUrlResponseSchema,
  type CreateUploadUrlInput,
  type MediaCompleteResponse,
  type UploadUrlResponse,
} from "../model/media.schema";

const mediaApi = createService("/media");

export const mediaService = {
  createUploadUrl(input: CreateUploadUrlInput): Promise<UploadUrlResponse> {
    const body = createUploadUrlInputSchema.parse(input);
    return mediaApi.post("/upload-url", body, { schema: uploadUrlResponseSchema });
  },

  completeUpload(mediaId: string): Promise<MediaCompleteResponse> {
    return mediaApi.post(`/${mediaId}/complete`, undefined, {
      schema: mediaCompleteResponseSchema,
    });
  },

  async uploadLocalFile(
    mediaId: string,
    file: File,
    uploadUrl: string,
    fieldName = "file",
  ): Promise<MediaCompleteResponse> {
    const formData = new FormData();
    formData.append(fieldName, file, file.name);

    const url = resolveBackendUrl(uploadUrl);
    const headers: HeadersInit = {};
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, { method: "POST", headers, body: formData });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        (payload as { error?: string; message?: string } | null)?.error ??
        (payload as { message?: string } | null)?.message ??
        "Media upload failed.";
      throw new Error(message);
    }

    const data = payload as { data?: unknown };
    const unwrapped = data?.data ?? payload;
    return mediaCompleteResponseSchema.parse(unwrapped);
  },

  async putToPresignedUrl(uploadUrl: string, file: File, mimeType: string): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": mimeType },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to storage.");
    }
  },
};
