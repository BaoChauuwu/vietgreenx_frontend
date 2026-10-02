"use client";

import Link from "next/link";
import { MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { useState } from "react";

import { getInitials } from "@/entities/user";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { formatAbsoluteTime, formatRelativeTime } from "@/shared/lib/format-relative-time";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { toastService } from "@/shared/lib/toast";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import type { Post } from "@/entities/post";
import { useSharePost } from "../api/share.queries";
import { resolveVietShopPreview } from "../lib/resolve-vietshop-preview";
import { copyPostLink, sharePostLink } from "../lib/share-post-link";
import { getPostsCopy } from "../posts.constants";
import { DeletePostDialog } from "./DeletePostDialog";
import { EditPostDialog } from "./EditPostDialog";
import { PostBodyContent } from "./PostBodyContent";
import { PostTagMeta } from "./PostTagMeta";
import { VietShopX247PostPreview } from "./VietShopX247PostPreview";

export interface PostReactionControl {
  reactionCount: number;
  /** Rendered reaction button (with picker) — built at widget layer */
  buttonSlot: React.ReactNode;
  /** Rendered breakdown bubbles — built at widget layer, null when no reactions */
  bubblesSlot: React.ReactNode;
}

export interface PostBlockAuthorInput {
  userId: string;
  displayName: string;
}

interface PostCardProps {
  post: Post;
  locale?: AppLocale;
  className?: string;
  onBlockAuthor?: (author: PostBlockAuthorInput) => void;
  reaction?: PostReactionControl;
  authorAction?: React.ReactNode;
  renderReportDialog?: (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    targetType: "post";
    targetId: string;
    locale: AppLocale;
  }) => React.ReactNode;
  /**
   * When provided, clickable areas (timestamp, body, comment button) call this instead of navigating to the detail page.
   * Image click prefers `onOpenTheater` when available.
   */
  onOpenDetail?: () => void;
  /** When provided, clicking the image calls this instead of onOpenDetail or navigating. */
  onOpenTheater?: () => void;
  /** When provided, clicking comment button calls this instead of onOpenDetail or focusing textarea. */
  onCommentClick?: () => void;
  /** When true, the media (images) will not be rendered. Useful for theater mode where media is displayed separately. */
  hideMedia?: boolean;
}

export type FeedPostCardProps = Pick<
  PostCardProps,
  "post" | "locale" | "className" | "onBlockAuthor" | "renderReportDialog"
>;

export function PostCard({
  post,
  locale = getClientLocale(),
  className,
  onOpenDetail,
  onOpenTheater,
  onCommentClick,
  onBlockAuthor,
  reaction,
  authorAction,
  hideMedia,
  renderReportDialog,
}: PostCardProps) {
  const { post: copy, toast: toastCopy, hashtags: hashtagCopy } = getPostsCopy(locale);
  const { user } = useUser();
  const sharePost = useSharePost();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const openEditDialog = () => {
    setMenuOpen(false);
    window.setTimeout(() => setEditOpen(true), 0);
  };

  const openDeleteDialog = () => {
    setMenuOpen(false);
    window.setTimeout(() => setDeleteOpen(true), 0);
  };

  const isOwner = Boolean(user?.id && user.id === post.author.userId);
  const canBlockAuthor = Boolean(user && !isOwner && onBlockAuthor);
  const roleLabel = isOwner && user?.role ? copy.roles[user.role] : undefined;
  const avatarSrc = resolveMediaUrl(post.author.avatarUrl);
  const imageSrc = resolveMediaUrl(post.media[0]?.cdnUrl);
  const createdAt = new Date(post.createdAt);
  const postHref = ROUTES.post(post.id);
  const reactionCount = reaction?.reactionCount ?? post.reactionCount;
  const hasEngagement = reactionCount > 0 || post.commentCount > 0;
  const vietShopPreview = resolveVietShopPreview(post);

  const showComingSoon = () => toastService.info(copy.comingSoon);
  const showHashtagComingSoon = () => toastService.info(hashtagCopy.exploreComingSoon);

  const trackExternalShare = () => {
    sharePost.mutate({ postId: post.id, shareType: "external_link" });
  };

  const handleCopyLink = async () => {
    const copied = await copyPostLink(post.id);
    if (copied) {
      toastService.success(toastCopy.linkCopied);
      trackExternalShare();
      return;
    }
    toastService.error(toastCopy.shareFailed);
  };

  const handleShare = async () => {
    const result = await sharePostLink(post.id, post.author.displayName);
    if (result === "failed") {
      toastService.error(toastCopy.shareFailed);
      return;
    }
    if (result === "copied") {
      toastService.success(toastCopy.linkCopied);
    }
    trackExternalShare();
  };

  return (
    <>
      <ElevatedCard className={cn("overflow-hidden", className)}>
        <CardHeader className="flex-row items-start gap-3 space-y-0 p-3 pb-2">
          <Avatar className="size-10 shrink-0">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={post.author.displayName} />}
            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
              {getInitials(post.author.displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-0.5 pt-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              {onOpenDetail ? (
                <button
                  type="button"
                  onClick={onOpenDetail}
                  className="max-w-full truncate text-left font-semibold leading-tight text-foreground hover:text-primary hover:underline focus:outline-none"
                >
                  {post.author.displayName}
                </button>
              ) : (
                <span className="max-w-full truncate font-semibold leading-tight text-foreground">
                  {post.author.displayName}
                </span>
              )}
              {roleLabel && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {roleLabel}
                </span>
              )}
            </div>

            {post.tags && post.tags.length > 0 && <PostTagMeta tags={post.tags} />}

            {onOpenDetail ? (
              <button
                type="button"
                onClick={onOpenDetail}
                className="block text-sm text-muted-foreground hover:underline focus:outline-none"
              >
                <time
                  dateTime={createdAt.toISOString()}
                  title={formatAbsoluteTime(createdAt, locale)}
                >
                  {formatRelativeTime(createdAt, locale)}
                </time>
              </button>
            ) : (
              <Link href={postHref} className="block text-sm text-muted-foreground hover:underline">
                <time
                  dateTime={createdAt.toISOString()}
                  title={formatAbsoluteTime(createdAt, locale)}
                >
                  {formatRelativeTime(createdAt, locale)}
                </time>
              </Link>
            )}
          </div>

          {authorAction ? <div className="shrink-0 self-start">{authorAction}</div> : null}

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground hover:bg-primary/5 hover:text-primary"
                aria-label={copy.menu}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      openEditDialog();
                    }}
                  >
                    {copy.edit}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(event) => {
                      event.preventDefault();
                      openDeleteDialog();
                    }}
                  >
                    {copy.delete}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  void handleCopyLink();
                }}
              >
                {copy.copyLink}
              </DropdownMenuItem>
              {canBlockAuthor ? (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(event) => {
                    event.preventDefault();
                    setMenuOpen(false);
                    onBlockAuthor?.({
                      userId: post.author.userId,
                      displayName: post.author.displayName,
                    });
                  }}
                >
                  {copy.block}
                </DropdownMenuItem>
              ) : null}
              {!isOwner ? (
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    setMenuOpen(false);
                    setReportOpen(true);
                  }}
                >
                  {copy.report}
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        {post.body ? (
          <div className="px-3 pb-2">
            {onOpenDetail ? (
              <div
                role="button"
                tabIndex={0}
                onClick={onOpenDetail}
                onKeyDown={(e) => e.key === "Enter" && onOpenDetail()}
                className="block w-full cursor-pointer text-left"
              >
                <PostBodyContent
                  body={post.body}
                  hashtags={post.hashtags}
                  className="text-sm leading-snug text-foreground/90 sm:text-[15px]"
                  onHashtagClick={showHashtagComingSoon}
                />
              </div>
            ) : (
              <PostBodyContent
                body={post.body}
                hashtags={post.hashtags}
                className="text-sm leading-snug text-foreground/90 sm:text-[15px]"
                onHashtagClick={showHashtagComingSoon}
              />
            )}
          </div>
        ) : null}

        {!hideMedia && imageSrc ? (
          <button
            type="button"
            onClick={onOpenTheater || onOpenDetail}
            disabled={!onOpenTheater && !onOpenDetail}
            className={cn(
              "relative block w-full overflow-hidden bg-muted/20 text-left focus:outline-none",
              (onOpenTheater || onOpenDetail) && "cursor-pointer",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              className="max-h-[600px] w-full object-contain"
              loading="lazy"
            />
          </button>
        ) : null}

        <CardContent className="space-y-0 p-0 pt-2">
          {vietShopPreview ? (
            <div className={cn("px-3", imageSrc || post.body ? "pb-2 pt-3" : "py-2")}>
              <VietShopX247PostPreview preview={vietShopPreview} locale={locale} />
            </div>
          ) : null}

          {/* Counts row */}
          {hasEngagement && (
            <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground sm:py-2.5 sm:text-[13px]">
              {reactionCount > 0 ? (
                <div className="flex items-center">{reaction?.bubblesSlot}</div>
              ) : (
                <span />
              )}
              {post.commentCount > 0 && <span>{copy.commentsSummary(post.commentCount)}</span>}
            </div>
          )}

          {/* Action buttons: 3 equal columns, icon + text */}
          <div className="grid grid-cols-3 border-t border-border">
            {reaction?.buttonSlot ?? (
              <PostActionButton
                icon={<span className="text-lg leading-none sm:text-xl">👍</span>}
                label={copy.like}
                onClick={showComingSoon}
              />
            )}
            <PostActionButton
              icon={<MessageCircle className="size-[18px] sm:size-5" />}
              label={copy.comment}
              onClick={
                onCommentClick ||
                onOpenDetail ||
                (() => {
                  const textarea = document.querySelector<HTMLTextAreaElement>("textarea");
                  textarea?.focus();
                })
              }
            />
            <PostActionButton
              icon={<Share2 className="size-[18px] sm:size-5" />}
              label={copy.share}
              onClick={() => void handleShare()}
            />
          </div>
        </CardContent>
      </ElevatedCard>

      {isOwner ? (
        <>
          <EditPostDialog post={post} open={editOpen} onOpenChange={setEditOpen} locale={locale} />
          <DeletePostDialog
            post={post}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            locale={locale}
          />
        </>
      ) : null}

      {renderReportDialog?.({
        open: reportOpen,
        onOpenChange: setReportOpen,
        targetType: "post",
        targetId: post.id,
        locale,
      })}
    </>
  );
}

interface PostActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: "primary";
  active?: boolean;
  disabled?: boolean;
}

function PostActionButton({
  icon,
  label,
  onClick,
  accent,
  active,
  disabled,
}: PostActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-1 rounded-md py-2.5 text-xs font-medium text-muted-foreground transition-colors sm:gap-1.5 sm:py-3 sm:text-sm",
        "hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        accent === "primary" && "hover:bg-primary/10 hover:text-primary",
        active && accent === "primary" && "text-primary",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
