import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const LocationMapPicker = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full animate-pulse items-center justify-center rounded-md border bg-muted">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});
