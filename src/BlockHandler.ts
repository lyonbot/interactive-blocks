import type { BlockContext } from "./BlockContext";
import type { SlotHandler, SlotInfo } from "./SlotHandler";
import { getValueOf, ValueOrGetter } from "./ValueOrGetter";

export interface BlockInfo {
  index: ValueOrGetter<number>;
  data: ValueOrGetter<Record<string, any>>;
  onActiveStatusChange?(element: BlockHandler): void;
}

export class BlockHandler {
  readonly type = "block";

  readonly ctx: BlockContext;
  readonly ownerSlot: SlotHandler | null;
  readonly slots = new Set<SlotHandler>();
  info: BlockInfo;

  private _activeNumber: false | number = false;

  /**
   * `false` if not selected. otherwise, the index (1,2,3...) in selection.
   */
  get activeNumber() {
    return this._activeNumber;
  }

  get isActive() {
    return this._activeNumber !== false;
  }

  /**
   * @internal NEVER CALL THIS! unless you know what's going on!
   * @param value new activeNumber
   * @returns whether activeNumber is actually changed
   */
  setSelectStatus(value: number | false) {
    if (this._activeNumber === value) return false;
    this._activeNumber = value;
    this.info.onActiveStatusChange?.(this);
    return true;
  }

  handlePointerUp = () => this.ctx.handleBlockPointerUp(this, false);
  handlePointerUpCapture = () => this.ctx.handleBlockPointerUp(this, true);

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

  dispose() {
    if (this.ctx.activeBlocks.has(this)) {
      this.ctx.activeBlocks.delete(this);
      this.ctx.syncActiveElementStatus();
    }

    this.ownerSlot?.items.delete(this);
    this.slots.forEach(slot => slot.dispose());
    this.slots.clear();
  }
}