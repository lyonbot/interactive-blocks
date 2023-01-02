import type { BlockContext } from "./BlockContext";
import type { SlotHandler, SlotInfo } from "./SlotHandler";
import { getValueOf, ValueOrGetter } from "./ValueOrGetter";
import { MultipleSelectType } from "./MultipleSelectType";
import { EventKeyStyle, FirstParameter, getStyledEventHandlersLUT } from "./utils";

export interface BlockInfo {
  index: ValueOrGetter<number>;
  data: ValueOrGetter<Record<string, any>>;

  /**
   * you can attach something (eg. `this` of component) as `blockHandler.ref`
   */
  ref?: any;

  /**
   * called when `isActive` or `hasFocus` is changed.
   *
   * when triggered, you shall update the appearance.
   */
  onStatusChange?(element: BlockHandler): void;
}

export interface BlockDOMEventHandlers {
  pointerUp(ev: Pick<PointerEvent, "eventPhase">): void;
  dragStart?(ev: Pick<DragEvent, "stopPropagation" | "dataTransfer" | "clientX" | "clientY">): void;
  dragLeave?(ev: Pick<DragEvent, never>): void;
  dragOver?(ev: Pick<DragEvent, never>): void;
  dragEnd?(ev: Pick<DragEvent, never>): void;
}

export class BlockHandler {
  readonly type = "block";

  readonly ctx: BlockContext;
  readonly ownerSlot: SlotHandler | null;
  readonly slots = new Set<SlotHandler>();
  info: BlockInfo;

  private _activeNumber: false | number = false;

  /**
   * `false` if not selected. otherwise, the index in current selection (starts from 1)
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

  handlePointerUp = (ev?: FirstParameter<BlockDOMEventHandlers["pointerUp"]>) => this.ctx.handleBlockPointerUp(this, ev);

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

  getDOMEvents<S extends EventKeyStyle>(
    eventKeyStyle: S,
    opt: { draggable?: boolean } = {}
  ) {
    const ans: BlockDOMEventHandlers = {
      pointerUp: this.handlePointerUp,
    };

    if (opt.draggable) Object.assign(this.ctx.dragging.getBlockDOMEventHandlers(this));

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
