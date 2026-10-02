import { api } from "@/shared/api/api";
import { createService } from "@/shared/api/create-service";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import {
  publicTraceTokenListSchema,
  publicTraceTokenSchema,
  type ListPublicTraceTokensParams,
  type PublicTraceToken,
  type PublicTraceTokenList,
} from "@/entities/public-trace-token";
import { qrQuotaSchema, type QrQuota } from "@/entities/qr-quota";

import { createGenerateQrInputSchema, type GenerateQrInput } from "../model/qr-input.schema";

const http = createService("/qr");

export interface ExportQrPdfInput {
  tokenIds: string[];
  layout: 4 | 9 | 16;
}

export const qrService = {
  list(params: ListPublicTraceTokensParams = {}): Promise<PublicTraceTokenList> {
    const { page = 1, limit = 20, batchId, productId, targetType } = params;
    return http.get<PublicTraceTokenList>(
      "",
      {
        params: {
          page,
          limit,
          ...(batchId ? { batchId } : {}),
          ...(productId ? { productId } : {}),
          ...(targetType ? { targetType } : {}),
        },
      },
      { schema: publicTraceTokenListSchema },
    );
  },

  async getForBatch(batchId: string): Promise<PublicTraceToken | null> {
    try {
      const result = await this.list({ batchId, targetType: "batch", limit: 1 });
      return result.items[0] ?? null;
    } catch {
      return null;
    }
  },

  generate(input: GenerateQrInput): Promise<PublicTraceToken> {
    const payload = createGenerateQrInputSchema(getClientLocale()).parse(input);
    return http.post<PublicTraceToken>("/generate", payload, { schema: publicTraceTokenSchema });
  },

  quota(): Promise<QrQuota> {
    return http.get<QrQuota>("/quota", undefined, { schema: qrQuotaSchema });
  },

  async exportPdf(input: ExportQrPdfInput): Promise<void> {
    const response = await api.post("/qr/export-pdf", input, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-labels-${input.layout}-per-page.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
