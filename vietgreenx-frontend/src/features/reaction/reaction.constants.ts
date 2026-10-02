import type { AppLocale } from "@/shared/i18n/locale";
import type { ReactionType } from "@/entities/reaction";

const REACTION_COPY = {
  vi: {
    like: "Thích",
    liked: "Đã thích",
    loginRequired: "Đăng nhập để thể hiện cảm xúc.",
    error: "Không thể cập nhật cảm xúc.",
    dialogTitle: "Cảm xúc",
    tabAll: "Tất cả",
    empty: "Chưa có cảm xúc nào.",
  },
  en: {
    like: "Like",
    liked: "Liked",
    loginRequired: "Sign in to react to this post.",
    error: "Could not update reaction.",
    dialogTitle: "Reactions",
    tabAll: "All",
    empty: "No reactions yet.",
  },
} as const;

export function getReactionCopy(locale: AppLocale) {
  return REACTION_COPY[locale] ?? REACTION_COPY.vi;
}

export const REACTION_META: Record<ReactionType, { emoji: string; labelVi: string; labelEn: string; color: string }> = {
  like:    { emoji: "👍", labelVi: "Thích",   labelEn: "Like",    color: "text-blue-500" },
  love:    { emoji: "❤️", labelVi: "Yêu thích", labelEn: "Love",    color: "text-rose-500" },
  helpful: { emoji: "💡", labelVi: "Hữu ích", labelEn: "Helpful", color: "text-amber-500" },
  trust:   { emoji: "✅", labelVi: "Tin tưởng", labelEn: "Trust",   color: "text-violet-500" },
  green:   { emoji: "🌱", labelVi: "Xanh",    labelEn: "Green",   color: "text-green-600" },
};

export function getReactionMeta(type: ReactionType, locale: AppLocale) {
  const meta = REACTION_META[type];
  return {
    emoji: meta.emoji,
    label: locale === "en" ? meta.labelEn : meta.labelVi,
    color: meta.color,
  };
}
