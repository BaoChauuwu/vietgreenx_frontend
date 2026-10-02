import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";

import { getProfileValidationCopy } from "../profile.constants";

export function createProfileEditFormSchema(locale: AppLocale) {
  const validation = getProfileValidationCopy(locale);

  return z.object({
    displayName: z.string().min(2, validation.displayNameMin).max(100, validation.displayNameMax),
    bio: z.string().max(500, validation.bioMax).optional(),
    website: z.string().max(255, validation.websiteMax).optional(),
    province: z.string().max(100, validation.provinceMax).optional(),
    ward: z.string().max(100, validation.wardMax).optional(),
    provinceCode: z.coerce.number().int().positive().optional(),
    wardCode: z.coerce.number().int().positive().optional(),
  });
}

export type ProfileEditFormInput = z.infer<ReturnType<typeof createProfileEditFormSchema>>;

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_ACCEPT = "image/png,image/jpeg,image/jpg,image/webp";

const ALLOWED_AVATAR_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

export function isAllowedAvatarFile(file: File): boolean {
  return ALLOWED_AVATAR_TYPES.has(file.type);
}
