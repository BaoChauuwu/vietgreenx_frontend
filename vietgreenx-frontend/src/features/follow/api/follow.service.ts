import { createService } from "@/shared/api/create-service";

import {
  followListSchema,
  followResponseSchema,
  type FollowList,
  type FollowResponse,
  type ListFollowParams,
} from "@/entities/follow";

const followHttp = createService("/follows");
const userHttp = createService("/users");

export const followService = {
  followUser(input: { followeeUserId: string }): Promise<FollowResponse> {
    return followHttp.post<FollowResponse>("", input, { schema: followResponseSchema });
  },

  followOrg(input: { followeeOrgId: string }): Promise<FollowResponse> {
    return followHttp.post<FollowResponse>("", input, { schema: followResponseSchema });
  },

  unfollow(targetId: string): Promise<FollowResponse> {
    return followHttp.delete<FollowResponse>(`/${targetId}`, undefined, {
      schema: followResponseSchema,
    });
  },

  followers({ userId, cursor, limit = 20 }: ListFollowParams): Promise<FollowList> {
    return userHttp.get<FollowList>(
      `/${userId}/followers`,
      { params: { ...(cursor ? { cursor } : {}), limit } },
      { schema: followListSchema },
    );
  },

  following({ userId, cursor, limit = 20 }: ListFollowParams): Promise<FollowList> {
    return userHttp.get<FollowList>(
      `/${userId}/following`,
      { params: { ...(cursor ? { cursor } : {}), limit } },
      { schema: followListSchema },
    );
  },
};
