import { createService } from "@/shared/api/create-service";
import {
  savedSupplierSchema,
  supplierReviewSchema,
  supplierReviewSummarySchema,
  type SavedSupplier,
  type SupplierReview,
  type SupplierReviewSummary,
  type CreateSupplierReviewInput,
} from "@/entities/supplier";

const http = createService("/suppliers");

export const supplierClientService = {
  // ─── Save / Unsave ─────────────────────────────────────────────────────────

  async saveSupplier(supplierId: string) {
    return http.post<SavedSupplier>(`/saved/${supplierId}`, undefined, {
      schema: savedSupplierSchema,
    });
  },

  async unsaveSupplier(supplierId: string) {
    return http.delete<unknown>(`/saved/${supplierId}`);
  },

  async listSavedSuppliers(page = 1, limit = 10) {
    return http.getPaginated<SavedSupplier>("/saved", savedSupplierSchema, {
      params: { page, limit },
    });
  },

  // ─── Reviews ───────────────────────────────────────────────────────────────

  async createReview(supplierId: string, input: CreateSupplierReviewInput) {
    return http.post<SupplierReview>(`/${supplierId}/reviews`, input, {
      schema: supplierReviewSchema,
    });
  },

  async listReviews(supplierId: string, page = 1, limit = 10) {
    return http.getPaginated<SupplierReview>(`/${supplierId}/reviews`, supplierReviewSchema, {
      params: { page, limit },
    });
  },

  async getReviewSummary(supplierId: string) {
    return http.get<SupplierReviewSummary>(`/${supplierId}/reviews/summary`, undefined, {
      schema: supplierReviewSummarySchema,
    });
  },
};
