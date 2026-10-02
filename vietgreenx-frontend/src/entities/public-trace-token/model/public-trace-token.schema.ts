import { z } from "zod";

export const traceTargetTypeSchema = z.enum(["product", "batch"]);

export const publicTraceTokenSchema = z.object({
  id: z.string().uuid(),
  token: z.string().uuid(),
  targetType: traceTargetTypeSchema,
  productId: z.string().uuid().nullable(),
  batchId: z.string().uuid().nullable(),
  qrImageUrl: z.string().nullable(),
  scanCount: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export type PublicTraceToken = z.infer<typeof publicTraceTokenSchema>;
export type TraceTargetType = z.infer<typeof traceTargetTypeSchema>;

export const publicTraceTokenListSchema = z.object({
  items: z.array(publicTraceTokenSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPage: z.number().int().nonnegative(),
});

export type PublicTraceTokenList = z.infer<typeof publicTraceTokenListSchema>;

export interface ListPublicTraceTokensParams {
  page?: number;
  limit?: number;
  batchId?: string;
  productId?: string;
  targetType?: TraceTargetType;
}
