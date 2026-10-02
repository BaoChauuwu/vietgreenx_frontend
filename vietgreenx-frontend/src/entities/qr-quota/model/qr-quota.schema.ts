import { z } from "zod";

export const qrQuotaSchema = z.object({
  qrGenerated: z.number().int().nonnegative(),
  qrLimit: z.number().int().nonnegative(),
  extraQuota: z.number().int().nonnegative(),
  billingPeriod: z.string(),
});

export type QrQuota = z.infer<typeof qrQuotaSchema>;

export function getQrQuotaTotal(quota: QrQuota): number {
  return quota.qrLimit + quota.extraQuota;
}

export function getQrQuotaRemaining(quota: QrQuota): number {
  return Math.max(0, getQrQuotaTotal(quota) - quota.qrGenerated);
}

export function getQrQuotaUsagePercent(quota: QrQuota): number {
  const total = getQrQuotaTotal(quota);
  if (total <= 0) return 0;
  return Math.min(100, Math.round((quota.qrGenerated / total) * 100));
}
