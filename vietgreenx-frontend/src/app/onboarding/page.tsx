import { redirect } from "next/navigation";

import { ROUTES } from "@/shared/routing";

/** Legacy route — product tour auto-starts on /feed instead. */
export default function OnboardingPage() {
  redirect(ROUTES.feed);
}
