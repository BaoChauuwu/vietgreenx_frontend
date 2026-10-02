import { z } from "zod";

export const publicStatsSchema = z.object({
  userCount: z.number().int().nonnegative(),
  qrScanCount: z.number().int().nonnegative(),
});

export type PublicStats = z.infer<typeof publicStatsSchema>;
