import { IBContext } from "./IBContext";
import { IBBlockEvents, IBSlotEvents } from "./definitions";
import { IBElementBase } from "./IBElementBase";

export type IBElement = IBBlock | IBSlot;

//----------------------------------------------------------------

/**
 * A "Block" is an item that can be selected, copied, or moved.
 *
 * Its data shall be a JavaScript object. Based on your design's granularity,
 * the block `data` may contain lots of data fields, or just single value.
 */
export class IBBlock extends IBElementBase<"block", IBBlockEvents, IBSlot> {
  constructor(parent: IBContext | IBSlot) {
    super("block", parent);
    this.ctx.hooks.blockCreated.call(this);
    this.ctx.blocks.add(this);
  }

  get isSelected() {
    return this.ctx.selectedBlocks.has(this);
  }

  dispose() {
    super.dispose();
    this.ctx.blocks.delete(this);
  }
}

//----------------------------------------------------------------

/**
 * A "Slot" is a list containing various blocks.
 * It also process block's inserting, moving and removing, based on the handlers you implemented.
 *
 * The slot `data` shall be a JavaScript array.
 */
export class IBSlot extends IBElementBase<"slot", IBSlotEvents, IBBlock> {
  constructor(parent: IBContext | IBBlock) {
    super("slot", parent);
    this.ctx.hooks.slotCreated.call(this);
    this.ctx.slots.add(this);
  }

  get isSelected() {
    return this.ctx.selectedSlot === this;
  }

  dispose() {
    super.dispose();
    this.ctx.slots.delete(this);
  }
}
