import { z } from "zod";

export const tradePostTypeSchema = z.enum(["sell", "buy"]);
export type TradePostType = z.infer<typeof tradePostTypeSchema>;

export const tradePostStatusSchema = z.enum(["active", "closed", "expired", "pending"]);
export type TradePostStatus = z.infer<typeof tradePostStatusSchema>;

export const tradePostPosterSchema = z.object({
  id: z.string(),
  username: z.string().optional().default(""),
  displayName: z.string().nullable().optional().default(""),
  avatarUrl: z.string().nullable().optional(),
});

export type TradePostPoster = z.infer<typeof tradePostPosterSchema>;

export const tradePostCategoryDtoSchema = z.object({
  id: z.string(),
  nameVi: z.string().optional().default(""),
  nameEn: z.string().optional().default(""),
  slug: z.string().optional().default(""),
});

export type TradePostCategoryDto = z.infer<typeof tradePostCategoryDtoSchema>;

export const tradePostSchema = z.preprocess(
  (val) => {
    if (val && typeof val === "object") {
      const raw = val as Record<string, unknown>;
      const rawType = raw.tradeType ?? raw.trade_type ?? raw.kind ?? raw.type;
      if (typeof rawType === "string" && rawType.trim()) {
        return {
          ...raw,
          tradeType: rawType.toLowerCase(),
        };
      }
    }
    return val;
  },
  z.object({
    id: z.string(),
    tradeType: z.union([z.string(), tradePostTypeSchema]).optional().default("sell"),
    status: z.union([z.string(), tradePostStatusSchema]).optional().default("active"),
    title: z.string(),
    quantity: z.union([z.number(), z.string()]).transform((v) => Number(v) || 0),
    quantityUnit: z.string().optional().default("kg"),
    priceReference: z.union([z.number(), z.string()]).nullable().optional(),
    province: z.string().nullable().optional(),
    provinceCode: z.union([z.number(), z.string()]).nullable().optional(),
    districtCode: z.union([z.number(), z.string()]).nullable().optional(),
    wardCode: z.union([z.number(), z.string()]).nullable().optional(),
    description: z.string().nullable().optional(),
    photoMediaIds: z.array(z.string()).optional().default([]),
    certRequirements: z.array(z.string()).optional().default([]),
    deadline: z.string().nullable().optional(),
    listingDays: z.number().optional().default(14),
    expiresAt: z.union([z.string(), z.date()]).optional(),
    interestedCount: z.number().optional().default(0),
    viewCount: z.number().optional().default(0),
    createdAt: z.union([z.string(), z.date()]).optional().default(""),
    poster: tradePostPosterSchema.nullable().optional(),
    category: tradePostCategoryDtoSchema.nullable().optional(),
  }),
);

export type TradePostItem = z.infer<typeof tradePostSchema>;

export const tradePostListResponseSchema = z.object({
  items: z.array(tradePostSchema).optional().default([]),
  total: z.number().optional().default(0),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  totalPage: z.number().optional().default(1),
});

export type TradePostListResponse = z.infer<typeof tradePostListResponseSchema>;

export const createSellOfferInputSchema = z.object({
  title: z.string().min(3),
  categoryId: z.string().uuid(),
  quantity: z.number().min(0.01),
  quantityUnit: z.string().min(1),
  priceReference: z.number().min(1).optional(),
  provinceCode: z.number().optional(),
  description: z.string().optional(),
  photoMediaIds: z.array(z.string()).optional(),
});

export type CreateSellOfferInput = z.infer<typeof createSellOfferInputSchema>;

export const createBuyRequestInputSchema = z.object({
  title: z.string().min(3),
  categoryId: z.string().uuid(),
  quantity: z.number().min(0.01),
  quantityUnit: z.string().min(1),
  priceReference: z.number().min(1).optional(),
  provinceCode: z.number().optional(),
  description: z.string().optional(),
  certRequirements: z.array(z.string()).optional(),
  deadline: z.string().optional(),
});

export type CreateBuyRequestInput = z.infer<typeof createBuyRequestInputSchema>;

export const updateTradePostInputSchema = createSellOfferInputSchema.partial();
export type UpdateTradePostInput = z.infer<typeof updateTradePostInputSchema>;
