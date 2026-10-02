import { publicRequest } from "@/shared/api/api";

import { publicStatsSchema, type PublicStats } from "../model/stats.schema";

export const statsService = {
  /** GET /stats — public landing metrics. */
  async getPublicStats(): Promise<PublicStats> {
    const data = await publicRequest<unknown>({ method: "GET", url: "/stats" });
    return publicStatsSchema.parse(data);
  },
};
