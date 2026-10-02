import { createService } from "@/shared/api/create-service";

import {
  profileResponseSchema,
  updateProfileInputSchema,
  type ProfileResponse,
  type UpdateProfileInput,
} from "../model/profile.schema";

/** BE: `UserProfileController` @ `app/users/:id/profile` → `/api/app/users/:id/profile`. */
function userProfileClient(userId: string) {
  return createService(`/users/${userId}/profile`);
}

export function fetchUserProfile(userId: string): Promise<ProfileResponse> {
  return userProfileClient(userId).get("", undefined, { schema: profileResponseSchema });
}

export function patchUserProfile(userId: string, input: UpdateProfileInput): Promise<ProfileResponse> {
  const payload = updateProfileInputSchema.parse(input);
  return userProfileClient(userId).patch("", payload, { schema: profileResponseSchema });
}
