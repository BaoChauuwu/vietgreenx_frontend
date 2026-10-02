import { z } from "zod";

import { UserRole } from "./roles";

export const authTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  accessTokenExpires: z.number().positive(),
  refreshToken: z.string().min(1),
  refreshTokenExpires: z.number().positive(),
  role: z.nativeEnum(UserRole),
  userId: z.string().uuid(),
});

export type AuthTokenPayload = z.infer<typeof authTokenResponseSchema>;
