import type { BlockHandler } from "./BlockHandler";
import type { SlotHandler } from "./SlotHandler";
import type { BlockContext } from "./BlockContext";

/** a utils for typescript, to make a data class with `preventDefault` and `returnValue` */
export const actionClass = <T>() => {
  type PreventDefaultAble = { preventDefault(): void; returnValue: boolean };
  type ActionType = T & PreventDefaultAble;

  function Action(this: ActionType, x: T) {
    Object.assign(this, x);
    this.returnValue = true;
    this.preventDefault = () => { this.returnValue = false; };
  }

  return Action as unknown as new (data: T) => ActionType;
};

export class IBInsertAction extends actionClass<{
  readonly type: "insert";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  readonly index: number; // insert before which item
  readonly blocksData: any[]; // data from clipboard
}>() { }

export class IBRemoveAction extends actionClass<{
  readonly type: "remove";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;

  /** the blocks to be cut, in selector order */
  readonly blocks: BlockHandler[];

  /**
   * the indexes of blocks to be cut, in selection order
   *
   * @see indexesDescending - to safely delete items, use this
   *
   * ```js
   * action.indexesDescending.forEach(index => array.splice(index, 1))
   * ```
   */
  readonly indexes: number[];

  /**
   * the indexes of blocks to be cut, in descending order
   *
   * ```js
   * // safely delete items one-by-one
   * action.indexesDescending.forEach(index => array.splice(index, 1))
   * ```
   */
  readonly indexesDescending: number[];
}>() { }

export class IBMoveInSlotAction extends actionClass<{
  readonly type: "moveInSlot";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  /** source blocks. theirs ownerSlot is the same as current slot! */
  readonly blocks: BlockHandler[];
  /** position after removing blocks, before inserting */
  readonly index: number;
}>() { }

export class IBMoveBetweenSlotsAction extends actionClass<{
  readonly type: "moveBetweenSlots";
  readonly ctx: BlockContext;

  readonly fromSlot: SlotHandler | null;
  /** source blocks. theirs ownerSlot is the same as fromSlot! */
  readonly blocks: BlockHandler[];

  readonly toSlot: SlotHandler;
  readonly index: number;
}>() { }

export class IBBlockDragStartAction extends actionClass<{
  readonly type: "blockDragStart";
  readonly ctx: BlockContext;
  /** all selected blocks that will be dragged */
  readonly blocks: readonly BlockHandler[];
  /** the current block which fires dragStart event */
  readonly currentBlock: BlockHandler;
  readonly event: DragEvent;
  readonly dataTransfer: DataTransfer;

  /** text content that writes to the dataTransfer. can be updated here. */
  text: string;
}>() { }

export class IBSlotBeforeDropAction extends actionClass<{
  readonly type: "slotBeforeDrop";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  readonly indexToDrop: number;

  readonly isDraggingFromCurrentCtx: boolean;
  /** if drag source is from current BlockContext, this will be the array of current dragging blocks */
  readonly draggingBlocks?: readonly BlockHandler[];

  readonly event: DragEvent;
  readonly dropEffect: "none" | "copy" | "link" | "move";
  readonly dataTransfer: DataTransfer;
}>() { }
