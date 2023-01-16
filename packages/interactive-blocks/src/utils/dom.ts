export function isFocusable(el: any): el is HTMLElement {
  if (!el || !el.parentNode || typeof el.matches !== "function" || el.matches(":disabled")) return false;
  if (el.matches("a[href], area[href], iframe")) return true;
  if (isInputBox(el)) return true;

  const tabIndex = el.getAttribute("tabindex");
  return typeof tabIndex === "string" && !isNaN(+tabIndex);
}

export function getRootOfNode(node: any) {
  const root = node?.getRootNode?.();
  if (!root) return null;

  if (root.nodeType === Node.DOCUMENT_NODE) return root as Document;
  if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) return root as ShadowRoot;

  return null;
}

export function isInputBox(el: any): el is HTMLElement {
  if (!el || typeof el.matches !== "function" || el.matches(":disabled")) return false;
  if (el.matches("input, textarea, select")) return true;

  const contentEditable = el.getAttribute("contenteditable");
  if (contentEditable && contentEditable !== "false") return true;

  return false;
}
