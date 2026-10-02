"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type TextareaHTMLAttributes,
} from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Textarea } from "@/shared/ui/textarea";

import { getActiveHashtagQuery, replaceActiveHashtag } from "../lib/hashtag-token";
import { usePostHashtagTypeahead } from "../lib/use-post-hashtag-typeahead";
import { useTextareaCaretViewportPosition } from "../lib/use-textarea-caret-viewport-position";
import { getPostsCopy } from "../posts.constants";
import { PostHashtagSuggestDropdown } from "./PostHashtagSuggestDropdown";

interface PostComposerTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  locale?: AppLocale;
  value: string;
  onChange: (value: string) => void;
}

export const PostComposerTextarea = forwardRef<HTMLTextAreaElement, PostComposerTextareaProps>(
  function PostComposerTextarea(
    { locale = getClientLocale(), value, onChange, className, disabled, ...props },
    ref,
  ) {
    const copy = getPostsCopy(locale).hashtags;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const { panelOpen, panelPhase, activeQuery, suggestions, cursor, syncCursor } =
      usePostHashtagTypeahead({
        value,
        textareaRef,
      });

    const showPanel = panelOpen && !dismissed;
    const { position: caretPosition, isReady: isCaretPositionReady } =
      useTextareaCaretViewportPosition(textareaRef, cursor, showPanel);

    useEffect(() => {
      if (panelOpen) setDismissed(false);
    }, [panelOpen, activeQuery]);

    useEffect(() => {
      setHighlightIndex(0);
    }, [activeQuery, suggestions.length]);

    const applyValue = (nextValue: string, nextCursor: number) => {
      onChange(nextValue);

      window.requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.setSelectionRange(nextCursor, nextCursor);
        syncCursor();
      });
    };

    const selectSuggestion = (tag: string) => {
      const el = textareaRef.current;
      if (!el) return;

      const { text, cursor: nextCursor } = replaceActiveHashtag(value, el.selectionStart, tag);
      applyValue(text, nextCursor);
      setDismissed(false);
      el.focus();
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
      syncCursor();
    };

    const handleSelectionSync = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      syncCursor();
      const el = event.currentTarget;
      const query = getActiveHashtagQuery(el.value, el.selectionStart ?? el.value.length);
      if (query === null) setDismissed(false);
    };

    const canPickSuggestion =
      showPanel && (panelPhase === "ready" || panelPhase === "empty") && activeQuery.length >= 1;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape" && showPanel) {
        event.preventDefault();
        setDismissed(true);
        return;
      }

      if (!canPickSuggestion) return;

      if (panelPhase === "ready" && suggestions.length > 0) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setHighlightIndex((prev) => (prev + 1) % suggestions.length);
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
          return;
        }

        if (event.key === "Enter" || event.key === "Tab") {
          event.preventDefault();
          const item = suggestions[highlightIndex];
          if (item) selectSuggestion(item.tag);
          return;
        }
      }

      if (panelPhase === "empty" && (event.key === "Enter" || event.key === "Tab")) {
        event.preventDefault();
        selectSuggestion(activeQuery);
      }
    };

    return (
      <div className="relative w-full">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onSelect={handleSelectionSync}
          onKeyDown={handleKeyDown}
          onClick={handleSelectionSync}
          onKeyUp={handleSelectionSync}
          onScroll={handleSelectionSync}
          disabled={disabled}
          className={cn(className)}
          {...props}
        />

        <PostHashtagSuggestDropdown
          open={showPanel && isCaretPositionReady}
          caret={caretPosition}
          phase={panelPhase}
          query={activeQuery}
          suggestions={suggestions}
          highlightIndex={highlightIndex}
          copy={copy}
          onSelect={selectSuggestion}
          onHighlight={setHighlightIndex}
        />
      </div>
    );
  },
);
