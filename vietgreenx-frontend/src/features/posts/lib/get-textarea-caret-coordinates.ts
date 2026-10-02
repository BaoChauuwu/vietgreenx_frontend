const MIRROR_STYLE_PROPS = [
  "direction",
  "boxSizing",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
] as const;

export interface TextareaCaretViewportPosition {
  /** Viewport Y at caret baseline (px) */
  top: number;
  /** Viewport X at caret (px) */
  left: number;
  height: number;
}

/**
 * Mirror div overlaid on the textarea in viewport space.
 * Returns caret coordinates in fixed/viewport pixels for portal positioning.
 */
export function getTextareaCaretViewportPosition(
  element: HTMLTextAreaElement,
  position: number,
): TextareaCaretViewportPosition {
  const computed = window.getComputedStyle(element);
  const elementRect = element.getBoundingClientRect();
  const mirror = document.createElement("div");
  const marker = document.createElement("span");

  mirror.style.position = "fixed";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.overflow = "auto";
  mirror.style.top = `${elementRect.top}px`;
  mirror.style.left = `${elementRect.left}px`;
  mirror.style.width = `${elementRect.width}px`;
  mirror.style.height = `${elementRect.height}px`;
  mirror.style.zIndex = "-1";

  for (const prop of MIRROR_STYLE_PROPS) {
    mirror.style.setProperty(prop, computed.getPropertyValue(prop));
  }

  marker.textContent = "\u200b";
  mirror.append(
    document.createTextNode(element.value.slice(0, position)),
    marker,
    document.createTextNode(element.value.slice(position)),
  );

  document.body.appendChild(mirror);
  mirror.scrollTop = element.scrollTop;
  mirror.scrollLeft = element.scrollLeft;

  const markerRect = marker.getBoundingClientRect();

  document.body.removeChild(mirror);

  const lineHeight =
    Number.parseFloat(computed.lineHeight) || Number.parseFloat(computed.fontSize) * 1.2 || 20;

  return {
    top: markerRect.top,
    left: markerRect.left,
    height: markerRect.height || lineHeight,
  };
}
