import { createService } from "@/shared/api/create-service";
import { resolveBackendUrl } from "@/shared/api/resolve-backend-url";
import { getAccessToken } from "@/shared/auth/token-storage";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import {
  certificationListSchema,
  certificationSchema,
  type Certification,
} from "@/entities/certification";

import {
  certUploadResponseSchema,
  certUploadUrlResponseSchema,
  createCertUploadUrlInputSchema,
  type CertUploadUrlResponse,
  type CreateCertUploadUrlInput,
} from "../model/cert-upload.schema";
import {
  createCreateCertificationInputSchema,
  createUpdateCertificationInputSchema,
  type CreateCertificationInput,
  type UpdateCertificationInput,
} from "../model/certification-input.schema";

const http = createService("/certifications");

export const certificationService = {
  listByProfile(greenProfileId: string): Promise<Certification[]> {
    return http.get<Certification[]>(
      `/profile/${greenProfileId}`,
      undefined,
      { schema: certificationListSchema },
    );
  },

  create(input: CreateCertificationInput): Promise<Certification> {
    const payload = createCreateCertificationInputSchema(getClientLocale()).parse(input);
    return http.post<Certification>("", payload, { schema: certificationSchema });
  },

  update(id: string, input: UpdateCertificationInput): Promise<Certification> {
    const payload = createUpdateCertificationInputSchema(getClientLocale()).parse(input);
    return http.patch<Certification>(`/${id}`, payload, { schema: certificationSchema });
  },

  delete(id: string): Promise<void> {
    return http.delete(`/${id}`);
  },

  createUploadUrl(input: CreateCertUploadUrlInput): Promise<CertUploadUrlResponse> {
    const body = createCertUploadUrlInputSchema.parse(input);
    return http.post("/upload-url", body, { schema: certUploadUrlResponseSchema });
  },

  async uploadLocalFile(
    file: File,
    uploadUrl: string,
    storageKey: string,
    fieldName = "file",
  ): Promise<void> {
    const formData = new FormData();
    formData.append(fieldName, file, file.name);
    formData.append("storageKey", storageKey);

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
        "Certification upload failed.";
      throw new Error(message);
    }

    const data = payload as { data?: unknown };
    certUploadResponseSchema.parse(data?.data ?? payload);
  },

  async putToPresignedUrl(uploadUrl: string, file: File, mimeType: string): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": mimeType },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload certification document.");
    }
  },

  async openDocument(documentUrl: string): Promise<void> {
    if (documentUrl.startsWith("http")) {
      window.open(documentUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const url = resolveBackendUrl(documentUrl);
    const headers: HeadersInit = {};
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error("Could not open certification document.");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  },
};
