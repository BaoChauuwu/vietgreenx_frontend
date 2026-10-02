import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
  showSinglePage?: boolean;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 3) {
    return Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  previousLabel = "Trang trước",
  nextLabel = "Trang sau",
  firstLabel = "Trang đầu",
  lastLabel = "Trang cuối",
  showSinglePage = false,
}: PaginationProps) {
  if (totalPages <= 1 && !showSinglePage) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const pages = getPageNumbers(currentPage, safeTotalPages);

  return (
    <div
      className={cn("flex flex-wrap items-center justify-center gap-1.5 py-2 sm:gap-2", className)}
    >
      {/* First Page Button << */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={firstLabel}
        title={firstLabel}
        className="size-9 rounded-xl border border-border/70 bg-background text-foreground transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 disabled:pointer-events-none disabled:opacity-30"
        onClick={() => onPageChange(1)}
        disabled={currentPage <= 1}
      >
        <ChevronsLeft className="size-4" />
      </Button>

      {/* Previous Page Button < */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={previousLabel}
        title={previousLabel}
        className="size-9 rounded-xl border border-border/70 bg-background text-foreground transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 disabled:pointer-events-none disabled:opacity-30"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {/* Page Numbers */}
      {pages.map((pageItem, idx) => {
        if (pageItem === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="flex size-9 select-none items-center justify-center text-xs font-bold text-muted-foreground"
            >
              ...
            </span>
          );
        }

        const isCurrent = pageItem === currentPage;

        return (
          <Button
            key={`page-${pageItem}`}
            type="button"
            variant={isCurrent ? "default" : "outline"}
            className={cn(
              "size-9 rounded-xl p-0 text-xs font-extrabold transition-all",
              isCurrent
                ? "scale-105 border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25 hover:border-emerald-500 hover:bg-emerald-500"
                : "border-border/70 bg-background text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700",
            )}
            onClick={() => onPageChange(pageItem)}
          >
            {pageItem}
          </Button>
        );
      })}

      {/* Next Page Button > */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={nextLabel}
        title={nextLabel}
        className="size-9 rounded-xl border border-border/70 bg-background text-foreground transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 disabled:pointer-events-none disabled:opacity-30"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="size-4" />
      </Button>

      {/* Last Page Button >> */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={lastLabel}
        title={lastLabel}
        className="size-9 rounded-xl border border-border/70 bg-background text-foreground transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 disabled:pointer-events-none disabled:opacity-30"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages}
      >
        <ChevronsRight className="size-4" />
      </Button>
    </div>
  );
}
