"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/shared/routing";
import { PostDetailDialog } from "./PostDetailDialog";

export function PostDetailDialogContainer({ postId }: { postId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.push(ROUTES.feed);
    }
  };

  if (!postId) return null;

  return <PostDetailDialog postId={postId} open={open} onOpenChange={handleOpenChange} />;
}
