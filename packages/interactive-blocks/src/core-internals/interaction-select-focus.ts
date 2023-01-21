import { IBElement } from "../IBElement";
import { IBContext } from "../IBContext";
import { normalizeMultipleSelectType } from "../utils/multiple-select";
import { simpleSyncHook } from "../utils/fn";
import { emitSelectionChangeEvents, updateSelection } from "./selection";
import { applyStylePatchTo } from "./style-patch";

/**
 * see <docs/under-the-hood/dom-and-interaction.md>
 *
 * this file also manages "hooks.focus"
 */

const pluginName = "interaction-select-focus";

const preventDefault = (ev: Event) => { ev.preventDefault(); };
export function setupInteractionSelectFocus(ctx: IBContext) {
  const domRoot = ctx.domRoot;

  let clearCtxFocusedHandlers: (() => void) | undefined;

  const globalPointerDown = (ev: PointerEvent) => {
    let target: IBElement | undefined;
    ev.composedPath().some(it => !!(target = ctx.dom2el.get(it as HTMLElement)));

    const block = target?.is === "block" ? target : target?.parent;
    const slot = target?.is === "slot" ? target : target?.parent;
    const multipleSelectType = !target ? "none" : normalizeMultipleSelectType(ev);

    const selectionChanges = updateSelection(
      ctx,
      block,
      multipleSelectType,
      slot || null     // if no slot selected, clear "ctx.selectedSlot"
    );

    emitSelectionChangeEvents(ctx, selectionChanges);

    // UX secret: disable context menu and selection, if modifier key pressed
    if (multipleSelectType !== "none") {
      document.addEventListener("contextmenu", preventDefault, true);
      document.addEventListener("selectstart", preventDefault, true);

      setTimeout(() => {
        document.removeEventListener("contextmenu", preventDefault, true);
        document.removeEventListener("selectstart", preventDefault, true);
      }, 100);
    }
  };

  const globalFocusOut = (ev: FocusEvent) => {
    if (ctx.hasFocus && !ctx.dom2el.has(ev.relatedTarget as any)) {
      // focus shifted outside of this context
      ctx.hasFocus = false;
      clearCtxFocusedHandlers?.();
      emitSelectionChangeEvents(ctx, {
        slots: [ctx.selectedSlot],
        blocks: ctx.selectedBlocks,
      });
      ctx.emit("blur", ctx);
    }
  };

  const globalFocusIn = (ev: FocusEvent) => {
    const isTargetKnownDOMElement = ctx.dom2el.has(ev.target as any);
    if (!ctx.hasFocus && isTargetKnownDOMElement) {
      // focus get into this context
      ctx.hasFocus = true;
      setupWhenCtxFocus();
      emitSelectionChangeEvents(ctx, {
        slots: [ctx.selectedSlot],
        blocks: ctx.selectedBlocks,
      });
      ctx.emit("focus", ctx);
    }

    if (isTargetKnownDOMElement) applyStylePatchTo(ev.target as HTMLElement);
  };

  domRoot.addEventListener("pointerdown", globalPointerDown as EventListener, true);
  domRoot.addEventListener("focusout", globalFocusOut as EventListener, true);
  domRoot.addEventListener("focusin", globalFocusIn as EventListener, true);
  ctx.hooks.dispose.tap(pluginName, () => {
    clearCtxFocusedHandlers?.();
    domRoot.removeEventListener("pointerdown", globalPointerDown as EventListener, true);
    domRoot.removeEventListener("focusout", globalFocusOut as EventListener, true);
    domRoot.removeEventListener("focusin", globalFocusIn as EventListener, true);
  });

  /**
   * call this only when `ctx.hasFocus` changes to `true`
   */
  function setupWhenCtxFocus() {
    const dispose = simpleSyncHook();
    dispose.tap(() => {
      clearCtxFocusedHandlers = undefined;
    });
    ctx.hooks.focus.call(ctx, dispose.tap);
    clearCtxFocusedHandlers = dispose.call;
  }
}
