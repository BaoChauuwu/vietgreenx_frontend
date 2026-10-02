import { z } from "zod";

export const reportTargetTypeSchema = z.enum(["post", "comment", "user", "product"]);

export const reportStatusSchema = z.enum(["pending", "under_review", "actioned", "dismissed"]);

// Must match BE ReportReason enum exactly.
export const REPORT_REASONS = [
  "spam",
  "counterfeit_goods",
  "misinformation",
  "harmful_content",
  "harassment",
  "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const reportInputSchema = z.object({
  targetId: z.string().min(1),
  targetType: reportTargetTypeSchema,
  reason: z.enum(REPORT_REASONS),
  // BE CreateReportRequestDto uses field name "details" (not "description")
  details: z.string().max(1000).optional(),
});

export const userReportItemSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  targetType: reportTargetTypeSchema,
  targetId: z.string(),
  reason: z.enum(REPORT_REASONS),
  details: z.string().nullable().optional(),
  status: reportStatusSchema,
  createdAt: z.string(),
});

export type ReportTargetType = z.infer<typeof reportTargetTypeSchema>;
export type ReportStatus = z.infer<typeof reportStatusSchema>;
export type ReportInput = z.infer<typeof reportInputSchema>;
export type UserReportItem = z.infer<typeof userReportItemSchema>;
