export const profileQueryKeys = {
  all: ["profile"] as const,
  me: (userId: string) => [...profileQueryKeys.all, userId] as const,
  detail: (userId: string) => [...profileQueryKeys.all, "detail", userId] as const,
};
