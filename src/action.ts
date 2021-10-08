import type { BlockHandler, SlotHandler } from ".";
import type { BlockContext } from "./BlockContext";

export interface CBClipboardData {
  isCBClipboardData: true;
  blocksData: any[];
}

export interface CBPasteAction {
  type: "paste";
  ctx: BlockContext;
  data: CBClipboardData; // data from clipboard
  slot: SlotHandler;
  index: number; // insert before which item
}

export interface CBCutAction {
  type: "cut";
  ctx: BlockContext;
  slot: SlotHandler;
  blocks: BlockHandler[];
}

export type CBAction = CBPasteAction | CBCutAction;
