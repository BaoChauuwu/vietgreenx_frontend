import { redirect } from "next/navigation";

import { ROUTES } from "@/shared/routing";

export default function OtpRedirectPage() {
  redirect(`${ROUTES.register}?tab=phone`);
}
