import { z } from "zod";

import { traceTargetTypeSchema } from "@/entities/public-trace-token";
import type { AppLocale } from "@/shared/i18n/locale";

import { getTraceValidationCopy } from "../trace.constants";

export function createGenerateQrInputSchema(locale: AppLocale) {
  const v = getTraceValidationCopy(locale);

  return z.object({
    targetType: traceTargetTypeSchema,
    batchId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
  }).superRefine((data, ctx) => {
    if (data.targetType === "batch" && !data.batchId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: v.batchIdRequired,
        path: ["batchId"],
      });
    }
    if (data.targetType === "product" && !data.productId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: v.targetTypeRequired,
        path: ["productId"],
      });
    }
  });
}

export type GenerateQrInput = z.infer<ReturnType<typeof createGenerateQrInputSchema>>;

export function createBatchQrInput(batchId: string): GenerateQrInput {
  return { targetType: "batch", batchId };
}
