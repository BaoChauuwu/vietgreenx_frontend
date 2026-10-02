import { z } from "zod";

export const userAvatarSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  username: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
});

export const publicUserSchema = userAvatarSchema.extend({
  bio: z.string().max(300).nullable(),
  followerCount: z.number().int().nonnegative(),
  followingCount: z.number().int().nonnegative(),
  postCount: z.number().int().nonnegative(),
  verificationTier: z.enum(["unverified", "basic", "certified", "trusted"]),
});

export type UserAvatar = z.infer<typeof userAvatarSchema>;

export type PublicUser = z.infer<typeof publicUserSchema>;

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function buildProfileUrl(username: string | null, id: string): string {
  return username ? `/@${username}` : `/profile?id=${id}`;
}
