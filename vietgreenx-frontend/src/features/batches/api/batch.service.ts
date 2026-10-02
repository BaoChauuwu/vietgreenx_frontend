import { createService } from "@/shared/api/create-service";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import {
  batchDetailSchema,
  batchListSchema,
  batchSchema,
  type Batch,
  type BatchDetail,
  type BatchList,
} from "@/entities/batch";

import {
  createCreateBatchInputSchema,
  createUpdateBatchInputSchema,
  type CreateBatchInput,
  type UpdateBatchInput,
} from "../model/batch-input.schema";

const http = createService("/batches");

export const batchService = {
  list(page = 1, limit = 20, productId?: string): Promise<BatchList> {
    return http.get<BatchList>(
      "",
      { params: { page, limit, ...(productId ? { productId } : {}) } },
      { schema: batchListSchema },
    );
  },

  byId(id: string): Promise<BatchDetail> {
    return http.get<BatchDetail>(`/${id}`, undefined, { schema: batchDetailSchema });
  },

  create(input: CreateBatchInput): Promise<Batch> {
    const payload = createCreateBatchInputSchema(getClientLocale()).parse(input);
    return http.post<Batch>("", payload, { schema: batchSchema });
  },

  update(id: string, input: UpdateBatchInput): Promise<Batch> {
    const payload = createUpdateBatchInputSchema(getClientLocale()).parse(input);
    return http.patch<Batch>(`/${id}`, payload, { schema: batchSchema });
  },
};
