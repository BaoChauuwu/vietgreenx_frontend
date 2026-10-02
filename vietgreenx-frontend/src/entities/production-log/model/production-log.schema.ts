import { z } from "zod";

export const activityTypeSchema = z.enum([
  "sowing",
  "caring",
  "fertilizing",
  "spraying",
  "irrigating",
  "harvesting",
  "other",
]);

export type ActivityType = z.infer<typeof activityTypeSchema>;

export const productionLogSchema = z.object({
  id: z.string(),
  cropSeasonId: z.string(),
  createdBy: z.string(),
  logDate: z.string(),
  activityType: z.preprocess(
    (val) => (typeof val === "string" ? val : "other"),
    activityTypeSchema.catch("other"),
  ),
  inputMaterial: z.string().nullable().optional(),
  dosage: z
    .union([z.string(), z.number()])
    .nullable()
    .optional()
    .transform((val) => (val != null ? String(val) : null)),
  dosageUnit: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  weather: z.string().nullable().optional(),
  pestStatus: z.string().nullable().optional(),
  estimatedYield: z
    .union([z.string(), z.number()])
    .nullable()
    .optional()
    .transform((val) => (val != null ? Number(val) : null)),
  mediaIds: z.preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()).default([])),
  media: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : []),
      z.array(
        z.object({
          id: z.string(),
          cdnUrl: z.string(),
          mimeType: z.string().optional(),
        }),
      ),
    )
    .default([]),
  medias: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : []),
      z.array(
        z.object({
          id: z.string(),
          cdnUrl: z.string(),
          mimeType: z.string().optional(),
        }),
      ),
    )
    .default([]),
  createdAt: z.string(),
  additionalNotes: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    z
      .array(
        z.object({
          id: z.string(),
          logId: z.string(),
          createdBy: z.string(),
          noteBody: z.string(),
          createdAt: z.string(),
        }),
      )
      .default([]),
  ),
});

export type ProductionLog = z.infer<typeof productionLogSchema>;

export const productionLogListSchema = z.object({
  items: z.array(productionLogSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPage: z.number().int().nonnegative(),
});

export type ProductionLogList = z.infer<typeof productionLogListSchema>;

export const emptyProductionLogList: ProductionLogList = {
  items: [],
  page: 1,
  limit: 50,
  total: 0,
  totalPage: 0,
};

export const productionLogNoteSchema = z.object({
  id: z.string().uuid(),
  logId: z.string().uuid(),
  createdBy: z.string().uuid(),
  noteBody: z.string(),
  createdAt: z.string(),
});

export type ProductionLogNote = z.infer<typeof productionLogNoteSchema>;

export const qrMilestoneSummarySchema = z.object({
  milestone: z.string(),
  logs: z.array(productionLogSchema),
});

export type QrMilestoneSummary = z.infer<typeof qrMilestoneSummarySchema>;

export const qrMilestoneSummaryListSchema = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return [value];
  return [];
}, z.array(qrMilestoneSummarySchema));

export type QrMilestoneSummaryList = z.infer<typeof qrMilestoneSummaryListSchema>;
