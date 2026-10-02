import { z } from "zod";

import { request } from "@/shared/api/api";
import { getRefreshToken } from "@/shared/auth/token-storage";

import { authMessageResponseSchema, authSessionSchema } from "../model/auth.schema";

export const authSessionService = {
  listSessions() {
    const refreshToken = getRefreshToken();
    return request<unknown>({
      method: "GET",
      url: "/auth/sessions",
      headers: refreshToken ? { "x-refresh-token": refreshToken } : undefined,
    }).then((data) => z.array(authSessionSchema).parse(data));
  },

  revokeSession(sessionId: string) {
    return request<unknown>({ method: "DELETE", url: `/auth/sessions/${sessionId}` }).then(
      (data) => authMessageResponseSchema.parse(data),
    );
  },

  revokeAllSessions() {
    return request<unknown>({ method: "DELETE", url: "/auth/sessions" }).then((data) =>
      authMessageResponseSchema.parse(data),
    );
  },
};
