import { IBContext } from "./IBContext";
import { IBBlockEvents, IBBlockOptions, IBSlotEvents, IBSlotOptions } from "./definitions";
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
  options: IBBlockOptions

  constructor(parent: IBContext | IBSlot, options: IBBlockOptions) {
    super("block", parent);
    this.options = options
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
  options: IBSlotOptions;

  constructor(parent: IBContext | IBBlock, options: IBSlotOptions) {
    super("slot", parent);
    this.options = options
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
