"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

import {
  getTextareaCaretViewportPosition,
  type TextareaCaretViewportPosition,
} from "./get-textarea-caret-coordinates";

const DEFAULT_POSITION: TextareaCaretViewportPosition = { top: 0, left: 0, height: 20 };

export function useTextareaCaretViewportPosition(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  cursor: number,
  enabled: boolean,
) {
  const [position, setPosition] = useState<TextareaCaretViewportPosition>(DEFAULT_POSITION);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element || !enabled) {
      setIsReady(false);
      return;
    }

    const update = () => {
      const caretIndex = element.selectionStart ?? cursor;
      setPosition(getTextareaCaretViewportPosition(element, caretIndex));
      setIsReady(true);
    };

    update();

    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      element.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      setIsReady(false);
    };
  }, [textareaRef, cursor, enabled]);

  return { position, isReady };
}
