import { z } from "zod";
import { createService } from "@/shared/api/create-service";
import type { PaginatedResult } from "@/shared/api";

import { reactionSchema, reactionTypeSchema, type Reaction, type ReactionType } from "@/entities/reaction";
import type { ReactInput, UnreactInput } from "../model/reaction-input.schema";
import { reactionListItemSchema, type ReactionListItem } from "../model/reaction-list.schema";

const http = createService("/reactions");

// BE envelope schema for list endpoint
const reactionListEnvelopeSchema = z.object({
  items: z.array(reactionListItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPage: z.number(),
});

export interface ListReactionsParams {
  targetId: string;
  targetType: "post" | "comment";
  reaction?: ReactionType;
  page?: number;
  limit?: number;
}

export const reactionService = {
  react(input: ReactInput): Promise<Reaction> {
    return http.post<Reaction>("", input, { schema: reactionSchema });
  },

  unreact(input: UnreactInput): Promise<void> {
    return http.delete<void>("", {
      params: {
        targetId: input.targetId,
        targetType: input.targetType,
      },
    });
  },

  async list(params: ListReactionsParams): Promise<PaginatedResult<ReactionListItem>> {
    const raw = await http.get("", { params }, { schema: reactionListEnvelopeSchema });
    return {
      data: raw.items,
      pagination: { total: raw.total, page: raw.page, limit: raw.limit, totalPages: raw.totalPage },
    };
  },
};
