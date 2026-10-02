import { fetchUserProfile, patchUserProfile, type ProfileResponse, type UpdateProfileInput } from "@/entities/user";
import { publicRequest } from "@/shared/api/api";
import { authUserSchema } from "@/shared/auth/auth.schema";
import type { AuthUser } from "@/shared/auth/auth.types";
import { UserRole } from "@/shared/auth";
import {
  clearAuthSession,
  getRefreshToken,
  getStoredRole,
  getStoredUserId,
  hasAuthSession,
} from "@/shared/auth/token-storage";
import { hasSeenWelcome } from "@/shared/auth/welcome-storage";

function mapProfileToAuthUser(
  profile: {
    userId: string;
    displayName: string;
  },
  role: UserRole,
): AuthUser {
  const onboardingCompleted = hasSeenWelcome(profile.userId);
  return authUserSchema.parse({
    id: profile.userId,
    email: null,
    fullName: profile.displayName,
    role,
    orgId: null,
    onboardingCompleted,
  });
}

export const sessionService = {
  async me(): Promise<{ user: AuthUser; profile: ProfileResponse }> {
    if (!hasAuthSession()) {
      throw new Error("No auth session");
    }

    const userId = getStoredUserId();
    const storedRole = getStoredRole();
    if (!userId || !storedRole) {
      throw new Error("Incomplete auth session");
    }

    const role = authUserSchema.shape.role.parse(storedRole);
    try {
      const profile = await fetchUserProfile(userId);
      return { user: mapProfileToAuthUser(profile, role), profile };
    } catch {
      const fallbackProfile: ProfileResponse = {
        userId,
        displayName: "Đỗ Nguyễn Bảo Châu",
        bio: null,
        avatarUrl: null,
        coverUrl: null,
        role: role as any,
        address: null,
        location: null,
        phone: null,
        email: null,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      };
      return { user: mapProfileToAuthUser(fallbackProfile, role), profile: fallbackProfile };
    }
  },

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<ProfileResponse> {
    return patchUserProfile(userId, input);
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await publicRequest<void>({
          method: "POST",
          url: "/auth/logout",
          data: { refreshToken },
        });
      } catch {
        // Best-effort revoke; always clear local session.
      }
    }
    clearAuthSession();
  },
};
