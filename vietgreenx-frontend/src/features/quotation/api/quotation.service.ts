import { createService } from "@/shared/api/create-service";
import {
  quotationSchema,
  quotationListResponseSchema,
  type QuotationItem,
  type QuotationListResponse,
  type CreateQuotationInput,
} from "@/entities/quotation";

const http = createService("/quotations");

export const quotationClientService = {
  create(input: CreateQuotationInput) {
    return http.post<QuotationItem>("", input, { schema: quotationSchema });
  },

  list(page = 1, limit = 10, type?: "received" | "sent") {
    return http.get<QuotationListResponse>(
      "",
      { params: { page, limit, direction: type } },
      { schema: quotationListResponseSchema },
    );
  },

  getById(id: string) {
    return http.get<QuotationItem>(`/${id}`, undefined, { schema: quotationSchema });
  },

  accept(id: string) {
    return http.patch<QuotationItem>(`/${id}/accept`, undefined, { schema: quotationSchema });
  },

  reject(id: string, rejectionNote?: string) {
    return http.patch<QuotationItem>(
      `/${id}/reject`,
      { rejectionNote: rejectionNote?.trim() || undefined },
      { schema: quotationSchema },
    );
  },

  withdraw(id: string) {
    return http.patch<QuotationItem>(`/${id}/withdraw`, undefined, { schema: quotationSchema });
  },
};
