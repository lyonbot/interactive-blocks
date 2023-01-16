import { actionClass } from "../core/action";
import { BlockContext } from "../core/BlockContext";
import { BlockHandler } from "../core/BlockHandler";
import { SlotHandler } from "../core/SlotHandler";

export class IBCopyAction extends actionClass<{
  readonly type: "copy";
  readonly ctx: BlockContext;
  readonly blocks: BlockHandler[];
}>() { }

export class IBCutAction extends actionClass<{
  readonly type: "cut";
  readonly ctx: BlockContext;
  readonly blocks: BlockHandler[];
}>() { }

export class IBPasteAction extends actionClass<{
  readonly type: "paste";
  readonly ctx: BlockContext;
  readonly slot: SlotHandler;
  readonly index: number; // insert before which item

  readonly clipboardData: DataTransfer;
  blocksData: any[]; // data will pass to "insert" event
}>() { }

declare module "../definitions" {
  export interface IBContextEvents {
    copy(action: IBCopyAction): void;
    cut(action: IBCutAction): void;

    /**
     * fires when user paste blocks from clipboard, before `insert` event
     *
     * - use `action.preventDefault()` to stop pasting
     * - can modify `action.blocksData` to change content for `insert` event
     */
    paste(action: IBPasteAction): void;
  }

  export interface IBActions {
    copy: IBCopyAction;
    cut: IBCutAction;
    paste: IBPasteAction;
  }
}
