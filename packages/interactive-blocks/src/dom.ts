import { wrapAsTrigger } from "./utils";

export function isFocusable(el: any): el is HTMLElement {
  if (!el || !el.parentNode || typeof el.matches !== "function" || el.matches(":disabled")) return false;
  if (el.matches("a[href], area[href], iframe")) return true;
  if (isInputBox(el)) return true;

  const tabIndex = el.getAttribute("tabindex");
  return typeof tabIndex === "string" && !isNaN(+tabIndex);
}

export const focusAnchorDataMark = "data-interactive-blocks-focus-anchor";
const focusAnchorStylePatch = document.createElement("style");
focusAnchorStylePatch.textContent = `[${focusAnchorDataMark}]:focus { outline: 0 }`;

export const enableFocusAnchorStyle = wrapAsTrigger((node: Element | null) => {
  let root = getRootOfNode(node)
  if (!root) return focusAnchorStylePatch.remove();

  let newRoot = root.querySelector('head, body') || root
  if (!focusAnchorStylePatch.parentNode?.isSameNode(newRoot)) newRoot.appendChild(focusAnchorStylePatch);
});

export function getRootOfNode(node: any) {
  let root = node?.getRootNode?.();
  if (!root) return null;

  if (root.nodeType === Node.DOCUMENT_NODE) return root as Document;
  if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) return root as ShadowRoot;

  return null
}

export function isInputBox(el: any): el is HTMLElement {
  if (!el || typeof el.matches !== "function" || el.matches(":disabled")) return false;
  if (el.matches("input, textarea, select")) return true;

  const contenteditable = el.getAttribute('contenteditable')
  if (contenteditable && contenteditable !== 'false') return true;

  return false
}
