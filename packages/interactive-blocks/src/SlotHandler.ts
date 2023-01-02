import type { IBCutAction, IBPasteAction } from "./action";
import type { BlockContext } from "./BlockContext";
import type { BlockHandler, BlockInfo } from "./BlockHandler";
import { head } from "./itertools";
import { EventKeyStyle, getStyledEventHandlersLUT } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SlotInfo {
  /**
   * you can attach something (eg. `this` of component) as `slotHandler.ref`
   */
  ref?: any;

  onCut?(action: IBCutAction): void;
  onPaste?(action: IBPasteAction): void;

  /**
   * called when `isActive` or `hasFocus` is changed.
   *
   * when triggered, you shall update the appearance.
   */
  onStatusChange?(slot: SlotHandler): void;
}

export interface SlotDOMEventHandlers {
  pointerUp: (ev: Pick<PointerEvent, "eventPhase">) => void;
  dragOver?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation" | "dataTransfer">) => void;
  dragLeave?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation">) => void;
  drop?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation" | "dataTransfer">) => void;
}

export class SlotHandler {
  readonly type = "slot";

  readonly ctx: BlockContext;
  readonly ownerBlock: BlockHandler | null;
  readonly items = new Set<BlockHandler>();
  info: SlotInfo;

  handlePointerUp = (ev?: Pick<PointerEvent, "eventPhase">) => {
    this.ctx.handleSlotPointerUp(this, ev);
  };

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
    this.ctx.activeBlocks =
      this.ctx.options.multipleSelect ? new Set(this.items)
        : this.items.size ? new Set([head(this.items)!])
          : new Set();

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

  getDOMEvents<S extends EventKeyStyle>(
    eventKeyStyle: S,
    opt: { draggable?: boolean } = {}
  ) {
    const ans: SlotDOMEventHandlers = {
      pointerUp: this.handlePointerUp,
    };

    if (opt.draggable) Object.assign(this.ctx.dragging.getSlotDOMEventHandlers(this));

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
  }
}