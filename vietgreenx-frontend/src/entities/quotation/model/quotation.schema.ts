import { z } from "zod";

export const quotationStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "expired",
  "withdrawn",
]);

export type QuotationStatus = z.infer<typeof quotationStatusSchema>;

export const quotationUserSchema = z.object({
  id: z.string(),
  username: z.string().optional().default(""),
  displayName: z.string().nullable().optional().default(""),
  avatarUrl: z.string().nullable().optional(),
});

export type QuotationUser = z.infer<typeof quotationUserSchema>;

export const quotationSchema = z.object({
  id: z.string(),
  tradePostId: z.string().nullable().optional(),
  productId: z.string().nullable().optional(),
  senderUserId: z.string().optional(),
  receiverUserId: z.string().optional(),
  offeredPrice: z.union([z.number(), z.string()]).transform((v) => Number(v) || 0),
  priceUnit: z.string().optional().default("VND/kg"),
  quantity: z.union([z.number(), z.string()]).transform((v) => Number(v) || 0),
  quantityUnit: z.string().optional().default("kg"),
  offeredQuantity: z.union([z.number(), z.string()]).optional(),
  unit: z.string().optional(),
  deliveryTerms: z.string().nullable().optional(),
  deliveryDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: quotationStatusSchema.optional().default("pending"),
  rejectionNote: z.string().nullable().optional(),
  acceptedAt: z.union([z.string(), z.date()]).nullable().optional(),
  rejectedAt: z.union([z.string(), z.date()]).nullable().optional(),
  validUntil: z.string().optional().default(""),
  expiresAt: z.union([z.string(), z.date()]).optional(),
  createdAt: z.union([z.string(), z.date()]).optional().default(""),
  sender: quotationUserSchema.optional(),
  receiver: quotationUserSchema.optional(),
});

export type QuotationItem = z.infer<typeof quotationSchema>;

export const quotationListResponseSchema = z.object({
  items: z.array(quotationSchema).optional().default([]),
  total: z.number().optional().default(0),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  totalPage: z.number().optional().default(1),
});

export type QuotationListResponse = z.infer<typeof quotationListResponseSchema>;

export const createQuotationInputSchema = z.object({
  tradePostId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  receiverUserId: z.string().uuid(),
  offeredPrice: z.number().min(0),
  priceUnit: z.string().min(1),
  quantity: z.number().min(0.01),
  quantityUnit: z.string().min(1),
  deliveryTerms: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateQuotationInput = z.infer<typeof createQuotationInputSchema>;
