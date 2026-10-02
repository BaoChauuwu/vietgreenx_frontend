"use client";

import { useState, useRef } from "react";
import { Star, Loader2, MessageSquarePlus, ImagePlus, X } from "lucide-react";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/cn";
import { formatAbsoluteTime } from "@/shared/lib/format-relative-time";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { uploadMedia, type UploadedMedia } from "@/entities/media";
import { toastService } from "@/shared/lib/toast";
import type { TraceReviewSummary } from "@/entities/trace";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy, useTraceReviews, useCreateTraceReview } from "@/features/traceability";
import { useUser } from "@/shared/auth";

interface PhotoItem {
  mediaId: string;
  previewUrl: string;
}

interface TraceReviewsPanelProps {
  token?: string;
  reviewsSummary?: TraceReviewSummary;
  locale?: AppLocale;
}

export function TraceReviewsPanel({
  token = "",
  reviewsSummary,
  locale = getClientLocale(),
}: TraceReviewsPanelProps) {
  const copy = getTraceCopy(locale).preview.reviews;
  const { user } = useUser();
  const { data, isLoading } = useTraceReviews(token);
  const createReview = useCreateTraceReview(token, locale);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  const { mutateAsync: uploadPhotoMutation, isPending: isUploadingPhoto } = useSingleFlightMutation<
    UploadedMedia,
    Error,
    File
  >({
    mutationFn: (file) => uploadMedia(file, "product_image"),
    onError: () => toastService.error(copy.toast.error),
  });

  const avgRating = reviewsSummary?.avgRating ?? 0;
  const reviewCount = reviewsSummary?.reviewCount ?? data?.total ?? 0;
  const reviewItems = data?.items || reviewsSummary?.items || [];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 5) {
      toastService.error(copy.photoLimitError);
      return;
    }

    try {
      const uploadedItems: PhotoItem[] = [];
      for (const file of files) {
        const uploaded = await uploadPhotoMutation(file);
        uploadedItems.push({
          mediaId: uploaded.mediaId,
          previewUrl: resolveMediaUrl(uploaded.cdnUrl) || URL.createObjectURL(file),
        });
      }
      setPhotos((prev) => [...prev, ...uploadedItems]);
    } catch {
      // Toast error handled in useSingleFlightMutation onError
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!token) return;
    try {
      await createReview.mutateAsync({
        rating,
        reviewBody: reviewBody.trim() || undefined,
        photoMediaIds: photos.map((p) => p.mediaId),
      });
      setDialogOpen(false);
      setReviewBody("");
      setPhotos([]);
      setRating(5);
    } catch {
      // Handled in query onError toast
    }
  };

  return (
    <ElevatedCard className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
      <CardHeader className="px-5 pb-0 pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-medium text-slate-800">{copy.title}</h3>

          {user ? (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 font-medium" disabled={!token}>
                  <MessageSquarePlus className="size-4" />
                  {copy.writeReview}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{copy.modalTitle}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {copy.ratingLabel}
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={cn(
                              "size-7 transition-colors",
                              star <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-100 text-slate-300",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      {copy.reviewBodyLabel}
                    </label>
                    <Textarea
                      placeholder={copy.reviewBodyPlaceholder}
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  {/* Photo Upload Section */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {copy.photosLabel}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto || photos.length >= 5}
                    />

                    <div className="flex flex-wrap gap-2.5">
                      {photos.map((item, idx) => (
                        <div
                          key={item.mediaId || idx}
                          className="group relative size-16 overflow-hidden rounded-lg border border-slate-200"
                        >
                          <img
                            src={item.previewUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}

                      {photos.length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="flex size-16 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                        >
                          {isUploadingPhoto ? (
                            <Loader2 className="size-5 animate-spin" />
                          ) : (
                            <>
                              <ImagePlus className="size-5" />
                              <span className="mt-1 text-[10px] font-medium">{copy.addPhoto}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDialogOpen(false)}
                    >
                      {copy.cancel}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={createReview.isPending || isUploadingPhoto}
                    >
                      {createReview.isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
                      {copy.submit}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-xs italic text-slate-400">{copy.loginToReview}</span>
          )}
        </div>

        {/* Summary box */}
        <div className="mb-4 flex items-center gap-6 rounded-xl border border-primary/10 bg-primary/5 p-5">
          <div className="shrink-0 text-center">
            <div className="flex items-baseline justify-center gap-1 text-primary">
              <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-primary/80">/ 5</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{copy.reviewCount(reviewCount)}</p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "size-5",
                  i <= Math.round(avgRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-300",
                )}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-slate-400">
            <Loader2 className="mr-2 size-5 animate-spin" />
            {copy.loading}
          </div>
        ) : reviewItems.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">{copy.emptyState}</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviewItems.map((review) => {
              const displayName =
                review.reviewer?.displayName?.trim() ||
                review.reviewer?.username ||
                copy.anonymousUser;
              const avatar = review.reviewer?.avatarUrl;
              const dateStr = review.createdAt
                ? formatAbsoluteTime(new Date(review.createdAt), locale)
                : "";

              return (
                <div key={review.id} className="flex gap-3 py-4 first:pt-2 last:pb-0">
                  <Avatar className="size-10 shrink-0 border border-slate-100">
                    {avatar && <AvatarImage src={avatar} alt={displayName} />}
                    <AvatarFallback className="bg-slate-100 text-xs font-semibold uppercase text-slate-600">
                      {displayName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800">
                        {displayName}
                      </span>
                      {dateStr && (
                        <span className="shrink-0 text-xs text-slate-400">{dateStr}</span>
                      )}
                    </div>

                    <div className="mt-0.5 flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3.5",
                            i <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-100 text-slate-200",
                          )}
                        />
                      ))}
                    </div>

                    {review.reviewBody && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                        {review.reviewBody}
                      </p>
                    )}

                    {review.photos && review.photos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.photos.map((photo, pIdx) => {
                          const src = resolveMediaUrl(photo.cdnUrl || photo.url);
                          if (!src) return null;
                          return (
                            <img
                              key={photo.id || pIdx}
                              src={src}
                              alt=""
                              className="shadow-xs size-16 rounded-lg border border-slate-100 object-cover"
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </ElevatedCard>
  );
}
