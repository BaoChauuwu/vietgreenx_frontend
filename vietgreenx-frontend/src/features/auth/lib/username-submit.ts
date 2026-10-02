import type { getAuthCopy } from "../auth.constants";
import { fetchUsernameAvailability } from "../api/auth.queries";
import { isUsernameCheckable } from "./username";
import type { UsernameAvailabilityState } from "./use-debounced-username-check";

type UsernameCopy = ReturnType<typeof getAuthCopy>["register"]["account"]["username"];

/** Ensures username is available before register submit. Skips API when already confirmed. */
export async function assertUsernameAvailableForSubmit(
  username: string,
  availability: UsernameAvailabilityState,
  copy: UsernameCopy,
): Promise<string | null> {
  if (availability.isConfirmedAvailable) return null;

  if (availability.isChecking) {
    return copy.checking;
  }

  if (availability.status === "taken") {
    return copy.taken;
  }

  if (availability.status === "error") {
    return copy.checkError;
  }

  if (!isUsernameCheckable(username)) {
    return null;
  }

  try {
    const result = await fetchUsernameAvailability(username);
    if (!result.available) return copy.taken;
    return null;
  } catch {
    return copy.checkError;
  }
}
