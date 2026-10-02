import { z } from "zod";

export const profileResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string(),
  bio: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  ward: z.string().nullable().optional(),
  provinceCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  districtCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  wardCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  isVerified: z.boolean().optional(),
  followerCount: z.number().optional(),
  followingCount: z.number().optional(),
  postCount: z.number().optional(),
  createdAt: z.string().optional(),
});

export type ProfileResponse = z.infer<typeof profileResponseSchema>;

export const updateProfileInputSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).nullable().optional(),
  avatarMediaId: z.string().uuid().nullable().optional(),
  website: z.string().max(255).nullable().optional(),
  province: z.string().max(100).nullable().optional(),
  district: z.string().max(100).nullable().optional(),
  ward: z.string().max(100).nullable().optional(),
  provinceCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  districtCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  wardCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
