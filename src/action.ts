import type { BlockHandler } from "./BlockHandler";
import type { SlotHandler } from "./SlotHandler";
import type { BlockContext } from "./BlockContext";

export interface IBClipboardData {
  readonly isIBClipboardData: true;
  readonly ibContextUUID?: string;
  readonly blocksData: any[];
}

export function isIBClipboardData(data: any): data is IBClipboardData {
  if (typeof data !== "object" || !data) return false;

  if (data.isIBClipboardData !== true) return false;
  if ("ibContextUUID" in data && typeof data.ibContextUUID !== "string") return false;
  if (!Array.isArray(data.blocksData)) return false;
  if (data.blocksData.some((x: any) => typeof x !== "object" || x === null)) return false;

  return true;
}

/** a utils for typescript, to make a data class with `preventDefault` and `returnValue` */
const actionClass = <T>() => {
  type ActionClass = T & { preventDefault(): void; returnValue: boolean };
  function Action(this: ActionClass, x: T) {
    Object.assign(this, x);
    this.returnValue = true;
    this.preventDefault = () => { this.returnValue = false; };
  }

  return Action as unknown as new (data: T) => ActionClass;
};

export type IBPasteAction = InstanceType<typeof IBPasteAction>;
export const IBPasteAction = actionClass<{
  readonly type: "paste";
  readonly ctx: BlockContext;
  readonly data: IBClipboardData; // data from clipboard
  readonly slot: SlotHandler;
  readonly index: number; // insert before which item
}>();

export type IBCutAction = InstanceType<typeof IBCutAction>;
export const IBCutAction = actionClass<{
  readonly type: "cut";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  readonly blocks: BlockHandler[];
}>();

export type IBMoveInSlotAction = InstanceType<typeof IBMoveInSlotAction>;
export const IBMoveInSlotAction = actionClass<{
  readonly type: "moveInSlot";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  /** source blocks. theirs ownerSlot is the same as current slot! */
  readonly blocks: BlockHandler[];
  /** position after removing blocks, before inserting */
  readonly index: number;
}>();

export type IBMoveBetweenSlotsAction = InstanceType<typeof IBMoveBetweenSlotsAction>;
export const IBMoveBetweenSlotsAction = actionClass<{
  readonly type: "moveBetweenSlots";
  readonly ctx: BlockContext;

  readonly fromSlot: SlotHandler | null;
  /** source blocks. theirs ownerSlot is the same as fromSlot! */
  readonly blocks: BlockHandler[];

  readonly toSlot: SlotHandler;
  readonly index: number;
}>();

export type IBAction = IBPasteAction | IBCutAction | IBMoveInSlotAction | IBMoveBetweenSlotsAction;

export type IBBlockDragStartAction = InstanceType<typeof IBBlockDragStartAction>;
export const IBBlockDragStartAction = actionClass<{
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
}>();

export type IBSlotBeforeDropAction = InstanceType<typeof IBSlotBeforeDropAction>;
export const IBSlotBeforeDropAction = actionClass<{
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
}>();
