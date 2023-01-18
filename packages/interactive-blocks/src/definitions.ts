/** this is a global definition file, abilities can extend */

import { IBBlock, IBSlot } from "./IBElement";
import { IBContext } from "./IBContext";
import { BlockSerializer } from "./types";
import { ValueOrGetter } from "./utils/ValueOrGetter";
import { IBInsertAction, IBMoveAction, IBRemoveAction, IBTransferIntoAction } from "./base-action";

export interface IBContextOptions {
  /**
   * default is true
   */
  multipleSelect?: boolean;

  /**
   * when copy and paste blocks, the block data will be converted to/from string
   *
   * here is the data convertor for every Slot, if a slot doesn't have its own "serializer"
   *
   * a serializer is an object that provides `stringify(data)` and `parse(str)` methods
   *
   * if not set, `JSON` is used as the default serializer.
   */
  serializer?: BlockSerializer;

  // ... can be extended
}

export interface IBContextEvents {
  // ... can be extended
  // myEvent(action: MyActionClass): void

  /** fires when "selectedBlocks" or "selectedSlot" changes */
  selectionChange(ctx: IBContext, changes: { slots: Set<IBSlot>; blocks: Set<IBBlock> }): void;

  /** fires when context get focus */
  focus(ctx: IBContext): void;

  /** fires when context lost focus */
  blur(ctx: IBContext): void;

  /** fires only when context is focused */
  keydown(ctx: IBContext, event: KeyboardEvent): void;

  /** called when context is being disposed, before (internal) plugins' "dispose" hook */
  dispose(ctx: IBContext): void;
}

export interface IBBlockOptions {
  index: ValueOrGetter<number, IBBlock>;
  data: ValueOrGetter<object, IBBlock>;

  // ... can be extended
}

export interface IBBlockEvents {
  /** fires when "isSelected" or "hasFocus" changes */
  statusChange(block: IBBlock): void;

  dispose(block: IBBlock): void;

  // ... can be extended
}

export interface IBSlotOptions {
  handleInsert(action: IBInsertAction): (void | Promise<void>);
  handleRemove(action: IBRemoveAction): (void | Promise<void>);
  handleMove(action: IBMoveAction): (void | Promise<void>);
  handleTransferInto(action: IBTransferIntoAction): (void | Promise<void>);

  /**
   * when copy and paste blocks, the block data will be converted to/from string with this `serializer`
   *
   * if not set, use `ctx.options.serializer`
   *
   * @see {@link IBContextOptions#serializer}
   */
  serializer?: BlockSerializer;

  // ... can be extended
}

export interface IBSlotEvents {
  /** fires when "isSelected" or "hasFocus" changes */
  statusChange(slot: IBSlot): void;

  dispose(slot: IBSlot): void;

  // ... can be extended
}
