import type { AppLocale } from "@/shared/i18n/locale";

const FOLLOW_COPY = {
  vi: {
    follow: "Theo dõi",
    following: "Đang theo",
    pending: "Đã gửi yêu cầu",
    unfollow: "Bỏ theo dõi",
    followSuccess: "Đã theo dõi.",
    unfollowSuccess: "Đã bỏ theo dõi.",
    pendingSuccess: "Đã gửi yêu cầu theo dõi.",
    alreadyFollowing: "Bạn đã theo dõi người này.",
    selfError: "Không thể theo dõi chính mình.",
    error: "Không thể cập nhật trạng thái theo dõi.",
  },
  en: {
    follow: "Follow",
    following: "Following",
    pending: "Requested",
    unfollow: "Unfollow",
    followSuccess: "Now following.",
    unfollowSuccess: "Unfollowed.",
    pendingSuccess: "Follow request sent.",
    alreadyFollowing: "You already follow this user.",
    selfError: "You cannot follow yourself.",
    error: "Could not update follow status.",
  },
} as const;

export function getFollowCopy(locale: AppLocale) {
  return FOLLOW_COPY[locale] ?? FOLLOW_COPY.vi;
}
