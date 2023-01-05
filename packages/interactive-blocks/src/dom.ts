import { wrapAsTrigger } from "./utils";

export function isFocusable(el: any): el is HTMLElement {
  if (!el || !el.parentNode || typeof el.matches !== "function" || el.matches(":disabled")) return false;
  if (el.matches("input, textarea, select, a[href], area[href], iframe")) return true;

  const tabIndex = el.getAttribute("tabindex");
  return typeof tabIndex === "string" && !isNaN(+tabIndex);
}

export const focusAnchorDataMark = "data-interactive-blocks-focus-anchor";
const el = document.createElement("style");
el.textContent = `[${focusAnchorDataMark}] { outline: 0 }`;

export const enableFocusAnchorStyle = wrapAsTrigger((node: Element | null) => {
  const root = node?.getRootNode();

  if (root) root.appendChild(el);
  else el.remove();
});
