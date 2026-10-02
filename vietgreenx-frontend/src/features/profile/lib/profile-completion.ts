import type { ProfileResponse } from "@/entities/user";
import { UserRole } from "@/shared/auth";

export type ProfileBannerType = "green-profile" | "org-setup" | "profile-completion";

export function isConsumerProfileComplete(
  profile: Pick<ProfileResponse, "avatarUrl" | "bio">,
): boolean {
  return Boolean(profile.avatarUrl?.trim() && profile.bio?.trim());
}

export function shouldShowProfileBanner(
  role: UserRole,
  orgId: string | null | undefined,
  profile: Pick<ProfileResponse, "avatarUrl" | "bio"> | undefined,
): boolean {
  if (!profile) return false;

  switch (role) {
    case UserRole.SELLER:
      return true;
    case UserRole.EXPERT:
      return !isConsumerProfileComplete(profile);
    case UserRole.COOPERATIVE:
    case UserRole.ENTERPRISE:
      return !orgId;
    case UserRole.CONSUMER:
      return !isConsumerProfileComplete(profile);
    default:
      return false;
  }
}

export function resolveProfileBannerType(
  role: UserRole,
  orgId: string | null | undefined,
): ProfileBannerType | null {
  switch (role) {
    case UserRole.SELLER:
      return "green-profile";
    case UserRole.EXPERT:
      return "profile-completion";
    case UserRole.COOPERATIVE:
    case UserRole.ENTERPRISE:
      return orgId ? null : "org-setup";
    case UserRole.CONSUMER:
      return "profile-completion";
    default:
      return null;
  }
}
