import { createService } from "@/shared/api/create-service";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import {
  cropSeasonListSchema,
  cropSeasonSchema,
  type CropSeason,
  type CropSeasonList,
  type ListCropSeasonsParams,
} from "@/entities/crop-season";

import {
  createCreateCropSeasonInputSchema,
  createUpdateCropSeasonInputSchema,
  updateCropSeasonStatusInputSchema,
  type CreateCropSeasonInput,
  type UpdateCropSeasonInput,
  type UpdateCropSeasonStatusInput,
} from "../model/crop-season-input.schema";

const http = createService("/crop-seasons");

export const cropSeasonService = {
  list(params: ListCropSeasonsParams = {}): Promise<CropSeasonList> {
    const { page = 1, limit = 20, status } = params;
    return http.get(
      "",
      {
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
        },
      },
      { schema: cropSeasonListSchema },
    );
  },

  byId(id: string): Promise<CropSeason> {
    return http.get<CropSeason>(`/${id}`, undefined, { schema: cropSeasonSchema });
  },

  create(input: CreateCropSeasonInput): Promise<CropSeason> {
    const parsed = createCreateCropSeasonInputSchema(getClientLocale()).parse(input);
    const payload = {
      seasonName: parsed.seasonName,
      cropType: parsed.cropType,
      areaHa: parsed.areaHa,
      startDate: parsed.startDate,
      expectedHarvestDate: parsed.expectedHarvestDate,
      ...(parsed.productId ? { productId: parsed.productId } : {}),
      ...(parsed.notes ? { notes: parsed.notes } : {}),
    };
    return http.post<CropSeason>("", payload, { schema: cropSeasonSchema });
  },

  update(id: string, input: UpdateCropSeasonInput): Promise<CropSeason> {
    const payload = createUpdateCropSeasonInputSchema(getClientLocale()).parse(input);
    return http.patch<CropSeason>(`/${id}`, payload, { schema: cropSeasonSchema });
  },

  updateStatus(id: string, input: UpdateCropSeasonStatusInput): Promise<CropSeason> {
    const payload = updateCropSeasonStatusInputSchema.parse(input);
    return http.patch<CropSeason>(`/${id}/status`, payload, { schema: cropSeasonSchema });
  },

  delete(id: string): Promise<void> {
    return http.delete(`/${id}`);
  },
};
