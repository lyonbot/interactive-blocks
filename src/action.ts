import type { BlockHandler } from "./BlockHandler";
import type { SlotHandler } from "./SlotHandler";
import type { BlockContext } from "./BlockContext";

export interface CBClipboardData {
  readonly isCBClipboardData: true;
  readonly cbContextUUID?: string;
  readonly blocksData: any[];
}

export function isCBClipboardData(data: any): data is CBClipboardData {
  if (typeof data !== "object" || !data) return false;

  if (data.isCBClipboardData !== true) return false;
  if ("cbContextUUID" in data && typeof data.cbContextUUID !== "string") return false;
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

export type CBPasteAction = InstanceType<typeof CBPasteAction>;
export const CBPasteAction = actionClass<{
  readonly type: "paste";
  readonly ctx: BlockContext;
  readonly data: CBClipboardData; // data from clipboard
  readonly slot: SlotHandler;
  readonly index: number; // insert before which item
}>();

export type CBCutAction = InstanceType<typeof CBCutAction>;
export const CBCutAction = actionClass<{
  readonly type: "cut";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  readonly blocks: BlockHandler[];
}>();

export type CBMoveInSlotAction = InstanceType<typeof CBMoveInSlotAction>;
export const CBMoveInSlotAction = actionClass<{
  readonly type: "moveInSlot";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  /** source blocks. theirs ownerSlot is the same as current slot! */
  readonly blocks: BlockHandler[];
  /** position after removing blocks, before inserting */
  readonly index: number;
}>();

export type CBMoveBetweenSlotsAction = InstanceType<typeof CBMoveBetweenSlotsAction>;
export const CBMoveBetweenSlotsAction = actionClass<{
  readonly type: "moveBetweenSlots";
  readonly ctx: BlockContext;

  readonly fromSlot: SlotHandler | null;
  /** source blocks. theirs ownerSlot is the same as fromSlot! */
  readonly blocks: BlockHandler[];

  readonly toSlot: SlotHandler;
  readonly index: number;
}>();

export type CBAction = CBPasteAction | CBCutAction | CBMoveInSlotAction | CBMoveBetweenSlotsAction;
