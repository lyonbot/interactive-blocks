/** this is a global definition file, abilities can extend */

import { IBInsertAction, IBMoveBetweenSlotsAction, IBMoveInSlotAction, IBRemoveAction } from "./core/action";
import { BlockContext } from "./core/BlockContext";
import { BlockSerializer } from "./types";

export interface IBActions {
  insert: IBInsertAction;
  remove: IBRemoveAction;
  moveInSlot: IBMoveInSlotAction;
  moveBetweenSlots: IBMoveBetweenSlotsAction;

  // ... can be extended
}

export type IBAction = IBActions[keyof IBActions];

export interface IBContextEvents {
  // ... can be extended
  // myEvent(action: MyActionClass): void

  /** fires when selection changes */
  activeElementChanged(ctx: BlockContext): void;

  /** fires when context get focus */
  focus(ctx: BlockContext): void;

  /** fires when context lost focus */
  blur(ctx: BlockContext): void;

  /** fires only when context is focused */
  keydown(event: KeyboardEvent, ctx: BlockContext): void;
}

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
