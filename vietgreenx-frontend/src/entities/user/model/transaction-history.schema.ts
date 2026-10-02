import { z } from "zod";

export const transactionDirectionSchema = z.enum(["sent", "received"]);
export type TransactionDirection = z.infer<typeof transactionDirectionSchema>;

export const transactionStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "expired",
  "withdrawn",
]);
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;

export const transactionPartnerSchema = z.object({
  userId: z.string(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});
export type TransactionPartner = z.infer<typeof transactionPartnerSchema>;

export const transactionHistoryItemSchema = z.object({
  id: z.string(),
  direction: transactionDirectionSchema,
  status: transactionStatusSchema,
  productId: z.string().nullable().optional(),
  productName: z.string().nullable().optional(),
  quantity: z.union([z.number(), z.string()]).transform((v) => Number(v) || 0),
  quantityUnit: z.string().optional().default("kg"),
  validUntil: z.string().nullable().optional(),
  partner: transactionPartnerSchema,
  createdAt: z.union([z.string(), z.date()]).optional(),
});
export type TransactionHistoryItem = z.infer<typeof transactionHistoryItemSchema>;

export const transactionHistoryListResponseSchema = z.object({
  items: z.array(transactionHistoryItemSchema).optional().default([]),
  total: z.number().optional().default(0),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  totalPage: z.number().optional().default(1),
});
export type TransactionHistoryListResponse = z.infer<typeof transactionHistoryListResponseSchema>;
