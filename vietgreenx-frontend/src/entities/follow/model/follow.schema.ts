import { z } from "zod";

export const followTargetTypeSchema = z.enum(["user", "organization"]);
export const followStatusSchema = z.enum(["pending", "active", "removed", "accepted"]);

// BE FollowResponseDto — POST /follows and POST /follows/:id/accept return only status
export const followSchema = z.object({
  status: followStatusSchema,
});

// Alias for backwards compatibility
export const followResponseSchema = followSchema;

// BE FollowItemResponseDto — GET /users/:id/followers and /following
export const followUserSchema = z.object({
  followId: z.string(),
  id: z.string(),
  type: followTargetTypeSchema,
  displayName: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
});

// Alias for backwards compatibility
export const followItemSchema = followUserSchema;

export const followListSchema = z.object({
  items: z.array(followUserSchema),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
  limit: z.number().int().positive(),
});

// BE FollowRequestDto — @IsXor: exactly one of followeeUserId or followeeOrgId
export const followInputSchema = z.union([
  z.object({ followeeUserId: z.string().min(1) }),
  z.object({ followeeOrgId: z.string().min(1) }),
]);

export type FollowTargetType = z.infer<typeof followTargetTypeSchema>;
export type FollowStatus = z.infer<typeof followStatusSchema>;
export type Follow = z.infer<typeof followSchema>;
export type FollowResponse = Follow;
export type FollowUser = z.infer<typeof followUserSchema>;
export type FollowItem = FollowUser;
export type FollowList = z.infer<typeof followListSchema>;
export type FollowInput = z.infer<typeof followInputSchema>;

export interface ListFollowParams {
  userId: string;
  cursor?: string;
  limit?: number;
}
