import { certificationService } from "../api/certification.service";

export async function uploadCertDocument(file: File): Promise<string> {
  const uploadTarget = await certificationService.createUploadUrl({
    fileName: file.name,
    mimeType: file.type,
    fileSize: file.size,
  });

  if (uploadTarget.uploadMethod === "PUT") {
    await certificationService.putToPresignedUrl(
      uploadTarget.uploadUrl,
      file,
      file.type,
    );
    return uploadTarget.storageKey;
  }

  await certificationService.uploadLocalFile(
    file,
    uploadTarget.uploadUrl,
    uploadTarget.storageKey,
    uploadTarget.uploadField ?? "file",
  );
  return uploadTarget.storageKey;
}
