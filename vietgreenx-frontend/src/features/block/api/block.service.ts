import { z } from "zod";

import { createService } from "@/shared/api/create-service";

import { blockListSchema, blockSchema, type Block, type BlockList } from "@/entities/block";
import type { CreateBlockInput } from "../model/block-input.schema";

const successSchema = z.object({ success: z.boolean() });

const http = createService("/blocks");

export const blockService = {
  list(page = 1, limit = 20): Promise<BlockList> {
    return http.get<BlockList>("", { params: { page, limit } }, { schema: blockListSchema });
  },

  create(input: CreateBlockInput): Promise<Block> {
    return http.post<Block>("", input, { schema: blockSchema });
  },

  remove(blockedUserId: string): Promise<{ success: boolean }> {
    return http.delete<{ success: boolean }>(`/${blockedUserId}`, undefined, { schema: successSchema });
  },
};
