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

export interface CBPasteAction {
  readonly type: "paste";
  readonly ctx: BlockContext;
  readonly data: CBClipboardData; // data from clipboard
  readonly slot: SlotHandler;
  readonly index: number; // insert before which item
}

export interface CBBeforePasteAction {
  readonly type: "beforePaste";
  readonly ctx: BlockContext;
  readonly data: CBClipboardData; // data from clipboard
  readonly slot: SlotHandler;
  // no index, because it might change later

  preventDefault(): void;
  returnValue: boolean;
}

export interface CBCutAction {
  readonly type: "cut";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  readonly blocks: BlockHandler[];
}

export type CBAction = CBBeforePasteAction | CBPasteAction | CBCutAction;
