import { getRootOfNode } from "../utils/dom";
import { wrapAsTrigger } from "../utils/fn";

const focusAnchorDataMark = "data-interactive-blocks-focus-anchor";
const focusAnchorStylePatch = document.createElement("style");
focusAnchorStylePatch.textContent = `[${focusAnchorDataMark}]:focus { outline: 0 }`;

const actualEnableStylePatch = wrapAsTrigger((root: ReturnType<typeof getRootOfNode>) => {
  if (!root) return focusAnchorStylePatch.remove();

  const newRoot = root.querySelector("head, body") || root;
  if (!focusAnchorStylePatch.parentNode?.isSameNode(newRoot)) newRoot.insertBefore(focusAnchorStylePatch, newRoot.firstElementChild);
});

/**
 * browser's default ":focus" has a weird outline
 *
 * we inject a `<style>` and add `[data-xxxx]` to the DOM Element to remove the style
 */
export const applyStylePatchTo = (node: HTMLElement | null) => {
  actualEnableStylePatch(getRootOfNode(node));

  if (node) {
    const remove = () => {
      node.removeAttribute(focusAnchorDataMark);
      node.removeEventListener("blur", remove);
    };

    node.setAttribute(focusAnchorDataMark, "");
    node.addEventListener("blur", remove);
  }
};
