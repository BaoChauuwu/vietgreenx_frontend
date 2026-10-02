import type { AuthUserPayload } from "./auth.schema";

/** AuthUser is derived from the Zod schema so shape and schema stay in sync. */
export type AuthUser = AuthUserPayload;

export interface AuthState {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
}
