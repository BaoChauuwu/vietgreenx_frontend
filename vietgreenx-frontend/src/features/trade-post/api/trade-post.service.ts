import { createService } from "@/shared/api/create-service";
import {
  tradePostSchema,
  tradePostListResponseSchema,
  type TradePostItem,
  type TradePostListResponse,
  type CreateSellOfferInput,
  type CreateBuyRequestInput,
  type UpdateTradePostInput,
} from "@/entities/trade-post";

const http = createService("/trade-posts");

export interface TradePostQueryParams {
  page?: number;
  limit?: number;
  kind?: "sell" | "buy";
  tradeType?: "sell" | "buy";
  category?: string;
  provinceCode?: string;
}

export const tradePostClientService = {
  createSellOffer(input: CreateSellOfferInput) {
    return http.post<TradePostItem>("", input, { schema: tradePostSchema });
  },

  createBuyRequest(input: CreateBuyRequestInput) {
    return http.post<TradePostItem>("/buy", input, { schema: tradePostSchema });
  },

  findAll(params?: TradePostQueryParams) {
    return http.get<TradePostListResponse>("", { params }, { schema: tradePostListResponseSchema });
  },

  findOne(id: string) {
    return http.get<TradePostItem>(`/${id}`, undefined, { schema: tradePostSchema });
  },

  update(id: string, input: UpdateTradePostInput) {
    return http.patch<TradePostItem>(`/${id}`, input, { schema: tradePostSchema });
  },

  close(id: string) {
    return http.delete<TradePostItem>(`/${id}`, undefined, { schema: tradePostSchema });
  },
};
