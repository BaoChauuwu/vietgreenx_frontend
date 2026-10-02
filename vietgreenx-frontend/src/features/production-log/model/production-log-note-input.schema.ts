import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";

import { getProductionLogValidationCopy } from "../production-log.constants";

export function createAddProductionLogNoteInputSchema(locale: AppLocale) {
  const v = getProductionLogValidationCopy(locale);

  return z.object({
    noteBody: z.string().trim().min(1, v.noteBodyRequired).max(2000),
  });
}

export type AddProductionLogNoteInput = z.infer<
  ReturnType<typeof createAddProductionLogNoteInputSchema>
>;

export interface AddProductionLogNoteVariables {
  logId: string;
  input: AddProductionLogNoteInput;
}
