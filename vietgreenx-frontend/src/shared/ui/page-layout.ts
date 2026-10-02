/** White card on grey social canvas — shared across feed + module pages */
export const VGX_ELEVATED_SURFACE = "vgx-elevated-surface";

/** @deprecated Use VGX_ELEVATED_SURFACE — alias kept for feed code */
export const VGX_FEED_SURFACE = VGX_ELEVATED_SURFACE;

/** 15px body rhythm on social / module pages */
export const VGX_CONTENT_COLUMN = "vgx-content-column";

/** Ghost rail item — nav chrome on canvas (hover/active micro-surface) */
export const VGX_GHOST_ITEM = "rounded-lg px-2 py-2 transition-colors hover:bg-card/80";

/** Active nav item on ghost rail */
export const VGX_MICRO_SURFACE =
  "rounded-lg bg-card font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]";

export type ModulePageWidth = "form" | "hub" | "work" | "profile" | "post" | "feed";

/** @deprecated Prefer SocialAppLayout variants — kept for width → variant mapping */
export const MODULE_PAGE_WIDTH_CLASS: Record<ModulePageWidth, string> = {
  form: "max-w-[720px]",
  hub: "max-w-[840px]",
  work: "max-w-[960px]",
  profile: "max-w-[1120px]",
  post: "max-w-[720px]",
  feed: "max-w-[1520px]",
};

export type SocialAppVariant = "social" | "workspace" | "focused";

export const SOCIAL_APP_SHELL_MAX: Record<SocialAppVariant, string> = {
  social: "max-w-full",
  workspace: "max-w-[1520px]",
  focused: "max-w-[1280px]",
};

export function getSocialAppGrid(variant: SocialAppVariant, hasRightRail: boolean): string {
  if (variant === "social") {
    return hasRightRail ? "lg:grid-cols-[minmax(0,1fr)_320px]" : "lg:grid-cols-1";
  }
  if (variant === "focused") {
    return "lg:grid-cols-1";
  }
  // workspace
  return hasRightRail ? "lg:grid-cols-[minmax(0,1fr)_280px]" : "lg:grid-cols-1";
}

export function moduleWidthToVariant(width: ModulePageWidth): SocialAppVariant {
  switch (width) {
    case "form":
      return "focused";
    case "post":
      return "workspace";
    case "feed":
      return "social";
    case "profile":
    case "work":
    case "hub":
    default:
      return "workspace";
  }
}
