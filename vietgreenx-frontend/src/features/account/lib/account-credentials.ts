import type { AccountCredentials, OtpChannel } from "../model/account.schema";

export function availableOtpChannels(credentials: AccountCredentials): OtpChannel[] {
  const channels: OtpChannel[] = [];
  if (credentials.email.present) channels.push("email");
  if (credentials.phone.present) channels.push("phone");
  return channels;
}

export function defaultOtpChannel(credentials: AccountCredentials): OtpChannel | null {
  const channels = availableOtpChannels(credentials);
  if (channels.length === 0) return null;
  if (channels.length === 1) return channels[0]!;
  if (credentials.registeredWith && channels.includes(credentials.registeredWith)) {
    return credentials.registeredWith;
  }
  return channels[0]!;
}
