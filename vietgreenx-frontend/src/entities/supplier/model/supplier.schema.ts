import { z } from "zod";

import { paginationMetaSchema } from "@/shared/api";

// ─── Saved Supplier Schemas ───────────────────────────────────────────────────

export const savedSupplierUserSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const savedSupplierSchema = z.object({
  id: z.string(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  supplier: savedSupplierUserSchema.optional().nullable(),
});

export const savedSupplierListResponseSchema = z.object({
  data: z.array(savedSupplierSchema),
  pagination: paginationMetaSchema,
});

// ─── Supplier Review Schemas ──────────────────────────────────────────────────

export const supplierReviewerSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const supplierReviewSchema = z.object({
  id: z.string(),
  rating: z.coerce.number().min(1).max(5),
  reviewBody: z.string().nullable().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  reviewer: supplierReviewerSchema.optional().nullable(),
});

export const supplierReviewListResponseSchema = z.object({
  data: z.array(supplierReviewSchema),
  pagination: paginationMetaSchema,
});

export const supplierReviewSummarySchema = z.object({
  avgRating: z.coerce.number().default(0),
  reviewCount: z.coerce.number().default(0),
  items: z.array(supplierReviewSchema).optional().default([]),
});

export const createSupplierReviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  reviewBody: z.string().max(2000).optional(),
  orderId: z.string().uuid().optional(),
  photoMediaIds: z.array(z.string().uuid()).optional(),
});

// ─── TypeScript Types ────────────────────────────────────────────────────────

export type SavedSupplierUser = z.infer<typeof savedSupplierUserSchema>;
export type SavedSupplier = z.infer<typeof savedSupplierSchema>;
export type SavedSupplierListResponse = z.infer<typeof savedSupplierListResponseSchema>;

export type SupplierReviewer = z.infer<typeof supplierReviewerSchema>;
export type SupplierReview = z.infer<typeof supplierReviewSchema>;
export type SupplierReviewListResponse = z.infer<typeof supplierReviewListResponseSchema>;
export type SupplierReviewSummary = z.infer<typeof supplierReviewSummarySchema>;
export type CreateSupplierReviewInput = z.infer<typeof createSupplierReviewInputSchema>;
