import { createService } from "@/shared/api/create-service";

import {
  createShareInputSchema,
  shareResponseSchema,
  type CreateShareInput,
  type ShareResponse,
} from "../model/share.schema";

const http = createService("/shares");

export const shareService = {
  create(input: CreateShareInput): Promise<ShareResponse> {
    const payload = createShareInputSchema.parse(input);
    return http.post<ShareResponse>("", payload, { schema: shareResponseSchema });
  },
};
