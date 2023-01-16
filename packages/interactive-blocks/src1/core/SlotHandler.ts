import type { IBRemoveAction, IBInsertAction } from "./action";
import type { BlockContext } from "./BlockContext";
import type { BlockHandler, BlockInfo } from "./BlockHandler";
import { EventKeyStyle, GetDOMEventsOptions, getStyledEventHandlersLUT, revokableFn, SlotDOMEventHandlers, StyledEventLUT } from "../domEvents";
import { head } from "../itertools";
import { assign } from "../utils";

export { SlotDOMEventHandlers };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SlotInfo {
  /**
   * called when some blocks are about to be removed from this slot.
   *
   * ❗ you shall implement the "delete" logic here
   */
  onCut?(action: IBRemoveAction): void;

  /**
   * called when we want to insert some blocks into this slot.
   *
   * ❗ you shall implement the "insert" logic here
   */
  onPaste?(action: IBInsertAction): void;

  /**
   * called when `isActive` or `hasFocus` is changed.
   *
   * ❗ you shall update the slot's style here
   */
  onStatusChange?(slot: SlotHandler): void;

  /**
   * (optional) attach something to `slotHandler.ref` (eg. Component Instance)
   */
  ref?: any;
}


export class SlotHandler {
  readonly is = "SlotHandler";

  readonly ctx: BlockContext;
  readonly ownerBlock: BlockHandler | null;
  readonly items = new Set<BlockHandler>();
  info: SlotInfo;

  /**
   * last element that emits "pointerup"
   * @internal - use
   */
  _lastElement: HTMLElement | undefined;

  handlePointerUp = revokableFn<SlotDOMEventHandlers["pointerUp"]>((ev) => {
    this.ctx.handleSlotPointerUp(this, ev);
  });

  constructor(ctx: BlockContext, ownerBlock: BlockHandler | null, info: SlotInfo) {
    this.ctx = ctx;
    this.ownerBlock = ownerBlock;
    if (ownerBlock) ownerBlock.slots.add(this);
    this.info = info;
  }

  createBlock(info: BlockInfo) {
    return this.ctx.createBlock(info, this);
  }

  get ref() {
    return this.info.ref;
  }

  private _isActive = false;

  get isActive() {
    return this._isActive;
  }

  get hasFocus() {
    return this.isActive && this.ctx.hasFocus;
  }

  /**
   * update `isActive` and invoke `onStatusChange`, if `isActive` is actually changed
   *
   * @internal
   * @param value new activeNumber
   * @returns whether activeNumber is actually changed
   */
  _maybeUpdateActive(value: boolean) {
    if (this._isActive === value) return false;
    this._isActive = value;
    this.info.onStatusChange?.(this);
    return true;
  }

  /**
   * make this slot active and select all content, without focusing
   *
   * note: if BlockContent disabled `multipleSelect`, only the first block will be selected.
   *
   * @see {@link SlotHandler.focus} - is often used with
   */
  select() {
    this.ctx.activeSlot = this;
    this.ctx.activeBlocks = new Set(
      this.ctx.options.multipleSelect ? this.items
        : this.items.size ? [head(this.items)!]
          : []
    );

    this.ctx.syncActiveElementStatus();
  }

  /**
   * make this slot active and move the focus to this BlockContext.
   *
   * note: if another slot was active, all blocks will be unselected.
   *
   * @see {@link SlotHandler.select} - you can call this before `focus`
   */
  focus() {
    if (!this.isActive) {
      this.ctx.activeBlocks.clear();
      this.ctx.activeSlot = this;
      this.ctx.syncActiveElementStatus();
    }
    this.ctx.focus();
  }

  isDescendantOfBlock(block: BlockHandler) {
    let ptr: BlockHandler | null | undefined = this.ownerBlock;

    while (ptr) {
      if (ptr === block) return true;
      ptr = ptr.ownerSlot?.ownerBlock;
    }

    return false;
  }

  isDescendantOfSlot(slot: SlotHandler) {
    let ptr: SlotHandler | null | undefined = this.ownerBlock?.ownerSlot;

    while (ptr) {
      if (ptr === slot) return true;
      ptr = ptr.ownerBlock?.ownerSlot;
    }

    return false;
  }

  getDOMEvents(): StyledEventLUT<SlotDOMEventHandlers, null>
  getDOMEvents<S extends EventKeyStyle>(eventKeyStyle: S, opt?: GetDOMEventsOptions): StyledEventLUT<SlotDOMEventHandlers, S>
  getDOMEvents<S extends EventKeyStyle>(eventKeyStyle?: S, opt: GetDOMEventsOptions = {}) {
    const ans: SlotDOMEventHandlers = {};

    if (opt.isWrapper ?? true) assign(ans, { pointerUp: this.handlePointerUp });
    if (opt.isDraggable) assign(ans, this.ctx.dragging.getSlotDOMEventHandlers(this));

    return getStyledEventHandlersLUT(ans, eventKeyStyle);
  }

  dispose() {
    let needSync = false;
    if (this.ctx.slotOfActiveBlocks === this) {
      this.ctx.activeBlocks.clear();
      needSync = true;
    }
    if (this.ctx.activeSlot === this) {
      this.ctx.activeSlot = null;
      needSync = true;
    }
    if (needSync) this.ctx.syncActiveElementStatus();

    this.ownerBlock?.slots.delete(this);
    this.items.forEach(child => child.dispose());
    this.items.clear();
    this.info = {};

    this._lastElement = void 0;
    this.handlePointerUp.revoke();
  }
}