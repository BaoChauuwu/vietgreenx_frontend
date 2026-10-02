import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";

import { getBlockValidationCopy } from "../block.constants";

export function createCreateBlockInputSchema(locale: AppLocale) {
  const v = getBlockValidationCopy(locale);

  return z.object({
    blockedUserId: z.string().uuid(v.userIdInvalid),
  });
}

export type CreateBlockInput = z.infer<ReturnType<typeof createCreateBlockInputSchema>>;
