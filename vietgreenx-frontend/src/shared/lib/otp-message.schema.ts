import { z } from "zod";

/** OTP / message responses from auth and account mutation endpoints. */
export const otpMessageResponseSchema = z.object({
  message: z.string().optional(),
  devOtp: z.string().optional(),
});

export type OtpMessageResponse = z.infer<typeof otpMessageResponseSchema>;
