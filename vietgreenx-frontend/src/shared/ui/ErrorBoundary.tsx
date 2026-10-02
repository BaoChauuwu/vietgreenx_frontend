// src/shared/ui/ErrorBoundary.tsx
// -----------------------------------------------------------------------------
// Class-based React Error Boundary — catches render-time crashes in the subtree
// and shows a fallback instead of a white screen. Pair this with Next.js's
// route-level `error.tsx` (below) for full coverage.
// -----------------------------------------------------------------------------
"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // TODO: replace with Sentry before production (e.g. Sentry.captureException)
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-lg font-medium">Đã có lỗi xảy ra.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Thử lại
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
