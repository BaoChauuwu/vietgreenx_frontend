export const greenProfileKeys = {
  all: ["green-profiles"] as const,
  me: () => [...greenProfileKeys.all, "me"] as const,
  org: (orgId: string) => [...greenProfileKeys.all, "org", orgId] as const,
  bySlug: (slug: string) => [...greenProfileKeys.all, "slug", slug] as const,
};
