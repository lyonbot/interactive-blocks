import type { BlockContext } from "./BlockContext";
import type { SlotHandler, SlotInfo } from "./SlotHandler";
import { getValueOf, ValueOrGetter } from "../ValueOrGetter";
import { MultipleSelectType } from "../MultipleSelectType";
import { BlockDOMEventHandlers, StyledEventLUT, GetDOMEventsOptions, EventKeyStyle, getStyledEventHandlersLUT, revokableFn } from "../domEvents";
import { assign } from "../utils";

export { BlockDOMEventHandlers };

export interface BlockInfo {
  /**
   * define how to get the index of this block
   *
   * ❗ you shall provide a function that returns an integer (starts from 0)
   */
  index: ValueOrGetter<number>;

  /**
   * define how to get the data of this block
   *
   * ❗ you shall provide a function that returns the value (can be anything, eg. object)
   */
  data: ValueOrGetter<Record<string, any>>;

  /**
   * called when `isActive` or `hasFocus` is changed.
   *
   * ❗ you shall update the block's style here
   */
  onStatusChange?(element: BlockHandler): void;

  /**
   * (optional) attach something to `blockHandler.ref` (eg. Component Instance)
   */
  ref?: any;
}



export class BlockHandler {
  readonly is = "BlockHandler";

  readonly ctx: BlockContext;
  readonly ownerSlot: SlotHandler | null;
  readonly slots = new Set<SlotHandler>();
  info: BlockInfo;

  private _activeNumber: false | number = false;

  /**
   * `false` if not selected. otherwise, the order number in current selection (starts from 1)
   */
  get activeNumber() {
    return this._activeNumber;
  }

  get isActive() {
    return this._activeNumber !== false;
  }

  get hasFocus() {
    return this.isActive && this.ctx.hasFocus;
  }

  get ref() {
    return this.info.ref;
  }

  /**
   * update `activeNumber` and invoke `onStatusChange`, if `activeNumber` is actually changed
   *
   * @internal
   * @param value new activeNumber
   * @returns whether activeNumber is actually changed
   */
  _maybeUpdateActiveNumber(value: number | false) {
    if (this._activeNumber === value) return false;
    this._activeNumber = value;
    this.info.onStatusChange?.(this);
    return true;
  }

  /** last element that emits "pointerup" @internal */
  _lastElement: HTMLElement | undefined;

  handlePointerUp = revokableFn<BlockDOMEventHandlers["pointerUp"]>((ev) => {
    this.ctx.handleBlockPointerUp(this, ev);
  });

  /**
   * select / active this block, without focusing
   *
   * @param multipleSelectType
   * @see {@link BlockHandler.focus}
   * @see {@link BlockContext.addBlockToSelection} - the underhood method
   */
  select(multipleSelectType?: MultipleSelectType) {
    this.ctx.addBlockToSelection(this, multipleSelectType);
  }

  /**
   * unselect this block, make `isActive` false
   */
  unselect() {
    if (!this.isActive) return;

    this.ctx.activeBlocks.delete(this);
    this.ctx.syncActiveElementStatus();
  }

  /**
   * select / active this block, and move the focus to this BlockContext
   *
   * @param multipleSelectType
   * @see {@link BlockHandler.select}
   * @see {@link BlockContext.addBlockToSelection} - the underhood method
   */
  focus(multipleSelectType?: MultipleSelectType) {
    if (!this.isActive) this.select(multipleSelectType);
    this.ctx.focus();
  }

  constructor(ctx: BlockContext, ownerSlot: SlotHandler | null, info: BlockInfo) {
    this.ctx = ctx;
    this.ownerSlot = ownerSlot;
    if (ownerSlot) ownerSlot.items.add(this);
    this.info = info;
  }

  get index() {
    return getValueOf(this.info.index, this);
  }

  get data() {
    return getValueOf(this.info.data, this);
  }

  createSlot(info: SlotInfo) {
    return this.ctx.createSlot(info, this);
  }

  getDOMEvents(): StyledEventLUT<BlockDOMEventHandlers, null>
  getDOMEvents<S extends EventKeyStyle>(eventKeyStyle: S, opt?: GetDOMEventsOptions): StyledEventLUT<BlockDOMEventHandlers, S>
  getDOMEvents<S extends EventKeyStyle>(eventKeyStyle?: S, opt: GetDOMEventsOptions = {}) {
    const ans: BlockDOMEventHandlers = {};

    if (opt.isWrapper ?? true) assign(ans, { pointerUp: this.handlePointerUp });
    if (opt.isDraggable) assign(ans, this.ctx.dragging.getBlockDOMEventHandlers(this));

    return getStyledEventHandlersLUT(ans, eventKeyStyle);
  }

  dispose() {
    if (this.ctx.activeBlocks.has(this)) {
      this.ctx.activeBlocks.delete(this);
      this.ctx.syncActiveElementStatus();
    }

    this.ownerSlot?.items.delete(this);
    this.slots.forEach((slot) => slot.dispose());
    this.slots.clear();
    this.info = emptyBlockInfo;

    this._lastElement = void 0;
    this.handlePointerUp.revoke();
  }
}

const emptyBlockInfo = {
  index: () => {
    throw new Error("Accessing a disposed block");
  },
  data: () => {
    throw new Error("Accessing a disposed block");
  },
};
