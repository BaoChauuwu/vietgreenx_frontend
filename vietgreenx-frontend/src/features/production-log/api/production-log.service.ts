import { createService } from "@/shared/api/create-service";
import { publicRequest } from "@/shared/api/api";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import {
  emptyProductionLogList,
  productionLogListSchema,
  productionLogNoteSchema,
  productionLogSchema,
  qrMilestoneSummaryListSchema,
  type ProductionLog,
  type ProductionLogList,
  type ProductionLogNote,
  type QrMilestoneSummaryList,
} from "@/entities/production-log";

import {
  createCreateProductionLogInputSchema,
  type CreateProductionLogInput,
} from "../model/production-log-input.schema";
import {
  createAddProductionLogNoteInputSchema,
  type AddProductionLogNoteInput,
} from "../model/production-log-note-input.schema";

const cropSeasonHttp = createService("/crop-seasons");
const productionLogHttp = createService("/production-logs");

export const productionLogService = {
  listBySeason(seasonId: string, page = 1, limit = 50): Promise<ProductionLogList> {
    return cropSeasonHttp.get<ProductionLogList>(
      `/${seasonId}/production-logs`,
      { params: { page, limit } },
      { schema: productionLogListSchema },
    );
  },

  async listBySeasons(seasonIds: string[], limitPerSeason = 50): Promise<ProductionLogList> {
    if (seasonIds.length === 0) {
      return emptyProductionLogList;
    }

    const pages = await Promise.all(
      seasonIds.map((seasonId) => this.listBySeason(seasonId, 1, limitPerSeason)),
    );

    const items = pages
      .flatMap((page) => page.items)
      .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());

    return {
      items,
      page: 1,
      limit: items.length,
      total: items.length,
      totalPage: items.length > 0 ? 1 : 0,
    };
  },

  byId(id: string): Promise<ProductionLog> {
    return productionLogHttp.get<ProductionLog>(`/${id}`, undefined, { schema: productionLogSchema });
  },

  create(seasonId: string, input: CreateProductionLogInput): Promise<ProductionLog> {
    const payload = createCreateProductionLogInputSchema(getClientLocale()).parse(input);
    return cropSeasonHttp.post<ProductionLog>(
      `/${seasonId}/production-logs`,
      payload,
      { schema: productionLogSchema },
    );
  },

  addNote(logId: string, input: AddProductionLogNoteInput): Promise<ProductionLogNote> {
    const payload = createAddProductionLogNoteInputSchema(getClientLocale()).parse(input);
    return productionLogHttp.post<ProductionLogNote>(`/${logId}/notes`, payload, {
      schema: productionLogNoteSchema,
    });
  },

  async qrSummaryBySeason(seasonId: string): Promise<QrMilestoneSummaryList> {
    const data = await publicRequest<unknown>({
      method: "GET",
      url: `/crop-seasons/${seasonId}/qr-summary`,
    });
    return qrMilestoneSummaryListSchema.parse(data);
  },
};
