import type { QueryClient } from "@tanstack/react-query";

import type { ProfileResponse } from "@/entities/user";
import { profileQueryKeys } from "@/shared/lib/profile-query-keys";

/** Seed React Query after auth bootstrap — avoids duplicate GET /users/:id. */
export function hydrateMyProfileCache(
  queryClient: QueryClient,
  profile: ProfileResponse,
): void {
  queryClient.setQueryData(profileQueryKeys.me(profile.userId), profile);
}
