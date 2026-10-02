import { cache } from "react";
import { createPublicService, createService } from "@/shared/api/create-service";
import {
  traceResponseSchema,
  reviewListResponseSchema,
  traceReviewItemSchema,
  type TraceResponse,
  type ReviewListResponse,
  type ReviewItem,
  type CreateReviewInput,
  type ReviewPhoto,
} from "@/entities/trace";
import { publicGreenProfileSchema, type PublicGreenProfile } from "@/entities/green-profile";

const http = createPublicService("");
const clientHttp = createService("/trace");

/**
 * Server-side fetch for public `/trace/[token]` SEO page (no auth).
 * Wrapped in React.cache() so generateMetadata and TracePageContent
 * share a single HTTP call per render pass.
 */
export const fetchTraceData = cache(async (token: string): Promise<TraceResponse | null> => {
  try {
    return await http.get(`/trace/${token}`, undefined, { schema: traceResponseSchema });
  } catch (err) {
    console.error(`[fetchTraceData] Failed to fetch trace data for token "${token}":`, err);
    return null;
  }
});

export async function fetchPublicGreenProfileData(
  slug: string,
): Promise<PublicGreenProfile | null> {
  try {
    return await http.get(`/green-profiles/${slug}`, undefined, {
      schema: publicGreenProfileSchema,
    });
  } catch (err) {
    return null;
  }
}

export type { ReviewPhoto, ReviewItem, ReviewListResponse, CreateReviewInput };

export const traceClientService = {
  getReviews(token: string, page = 1, limit = 10) {
    return clientHttp.get<ReviewListResponse>(
      `/${token}/reviews`,
      { params: { page, limit } },
      { schema: reviewListResponseSchema },
    );
  },

  createReview(token: string, input: CreateReviewInput) {
    return clientHttp.post<ReviewItem>(`/${token}/reviews`, input, {
      schema: traceReviewItemSchema,
    });
  },
};
