import { IBBlock, IBSlot } from "../IBElement";
import { IBContext } from "../IBContext";
import { NormalizedMultipleSelectType, normalizeMultipleSelectType } from "../utils/multiple-select";
import { isFocusable } from "../utils/dom";
import { simpleSyncHook } from "../utils/fn";
import { warn } from "../utils/warn";
import { emitSelectionChangeEvents, updateSelection } from "./selection";
import { enableStylePatch } from "./style-patch";

/**
 * see under-the-hood.md - "Select and Focus"
 *
 * this file also manages "hooks.focus"
 */

const pluginName = "interaction-select-focus";

declare module "../IBContext" {
  export interface IBContext {
    _pointerDownTrace?: PointerDownTrace;
    _invokeBlurCallbacks?: () => void;
  }
}

interface PointerDownTrace {
  multipleSelectType: NormalizedMultipleSelectType;

  /** in reversed order: [first bubbled] -> [last bubbled] */
  trace: Array<{ block?: IBBlock; slot?: IBSlot; el: HTMLElement | null }>;
}

export function setupInteractionSelectFocus(ctx: IBContext) {
  const globalPointerDownListener = (ev: PointerEvent) => {
    ctx._pointerDownTrace = {
      multipleSelectType: normalizeMultipleSelectType(ev),
      trace: [],
    };
    bindPhase2Listeners(ctx);
  };

  document.addEventListener("pointerdown", globalPointerDownListener, true);
  ctx.hooks.dispose.tap(pluginName, () => {
    ctx._invokeBlurCallbacks?.();
    document.removeEventListener("pointerdown", globalPointerDownListener, true);
  });

  ctx.hooks.slotCreated.tap(pluginName, (slot) => { slot.handlePointerDown = getElementPointerDownHandler(ctx, { slot }); });
  ctx.hooks.blockCreated.tap(pluginName, (block) => { block.handlePointerDown = getElementPointerDownHandler(ctx, { block }); });
}

function getElementPointerDownHandler(ctx: IBContext, target: { block?: IBBlock; slot?: IBSlot }) {
  return (ev: PointerEvent) => {
    const trace = ctx._pointerDownTrace;
    if (!trace) return; // incorrect time

    const isBubbling = ev.eventPhase === Event.BUBBLING_PHASE;

    let el = ev.currentTarget as HTMLElement | null;
    if (el && !isFocusable(el)) {
      warn(el, "missing tabIndex on element", el);
      el = null;
    }

    trace.trace[isBubbling ? "push" : "unshift"]({
      el,
      ...target,
    });

    (target.block || target.slot)!.lastDOMElement = el;
  };
}

function bindPhase2Listeners(ctx: IBContext) {
  const listener = (ev: FocusEvent | PointerEvent) => {
    const trace = ctx._pointerDownTrace;

    document.removeEventListener("blur", listener, true);
    document.removeEventListener("pointerup", listener, true);
    ctx._pointerDownTrace = undefined;

    // ----------------------------------------------------------------
    // update context's `activeBlocks` and `activeSlot`

    let newBlock: IBBlock | undefined;
    let newSlot: IBSlot | undefined;
    let multipleSelectType: NormalizedMultipleSelectType = trace?.multipleSelectType || "none";

    if (trace) {
      // click happens inside this context
      newBlock = trace.trace.find(x => x.block)?.block;
      newSlot = trace.trace.find(x => x.slot)?.slot;
      if ("pointerId" in ev) multipleSelectType = normalizeMultipleSelectType(ev);
    }

    const selectionChanges = updateSelection(ctx, newBlock, multipleSelectType, newSlot);

    // ----------------------------------------------------------------
    // update context's focus status -- `hasFocus`

    const wantedActiveElement = trace?.trace[0]?.el;
    const hasFocus = !!wantedActiveElement && (document.activeElement === wantedActiveElement);
    const focusStatusChanged = ctx.hasFocus !== hasFocus;

    ctx.hasFocus = hasFocus;

    // ----------------------------------------------------------------
    // internal: call hooks

    if (focusStatusChanged) {
      if (hasFocus) {
        const dispose = simpleSyncHook();
        dispose.tap(() => { ctx._invokeBlurCallbacks = undefined; });
        ctx.hooks.focus.call(ctx, dispose.tap);
        ctx._invokeBlurCallbacks = dispose.call;
      } else {
        ctx._invokeBlurCallbacks?.();
      }
    }

    // ----------------------------------------------------------------
    // internal: style patch to remove Chrome outline

    enableStylePatch(hasFocus ? wantedActiveElement! : null);

    // ----------------------------------------------------------------
    // emit events

    if (focusStatusChanged) {
      // if focus status changed, all new/old slots/blocks must be notified
      const blocks = new Set([...ctx.selectedBlocks, ...selectionChanges?.blocks || []]);
      const slots = new Set([ctx.selectedSlot, ...selectionChanges?.slots || []]);

      blocks.forEach(block => block.emit("statusChange", block));
      slots.forEach(slot => slot?.emit("statusChange", slot));
      ctx.emit(hasFocus ? "focus" : "blur", ctx);
    } else {
      // otherwise, maybe selection changed
      emitSelectionChangeEvents(ctx, selectionChanges);
    }

    if (selectionChanges) ctx.emit("selectionChange", ctx, selectionChanges);
  };

  document.addEventListener("blur", listener, true);
  document.addEventListener("pointerup", listener, true);
}
