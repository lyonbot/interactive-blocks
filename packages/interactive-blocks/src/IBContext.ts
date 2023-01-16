import { TypedEmitter } from "tiny-typed-emitter";
import { SyncHook, SyncBailHook } from "tapable";
import { IBContextEvents, IBContextOptions } from "./definitions";
import { MultipleSelectType } from "./utils/multiple-select";
import { IBBlock, IBSlot } from "./IBElement";
import { emitSelectionChangeEvents, startDiffSelection, updateSelection } from "./core-internals/selection";
import { setupInteractionSelectFocus } from "./core-internals/interaction-select-focus";
import { setupInteractionKeydown } from "./core-internals/interaction-keydown";
import { MaybeArray } from "./utils/array";

export class IBContext extends TypedEmitter<IBContextEvents> {
  static setupHook = new SyncHook<[IBContext, IBContextOptions]>(["context", "options"]);

  options: IBContextOptions;
  hooks = {
    dispose: new SyncHook<[IBContext]>(["context"]),

    /**
     * called when context get focus, may bind listeners to document
     *
     * - particularly, for "keydown", use `hooks.keydown` to add handlers
     * - always use `addBlurCallback()` to register a "listener remover"
     */
    focus: new SyncHook<[IBContext, (onBlur: () => void) => void]>(["context", "addBlurCallback"]),

    /**
     * a plugin may return `true` to mark the event handled, and bail other plugins' keydown listeners
     */
    keydown: new SyncBailHook<[IBContext, KeyboardEvent], boolean | void>(["context", "event"]),

    slotCreated: new SyncHook<[IBSlot]>(["slot"]),
    blockCreated: new SyncHook<[IBBlock]>(["block"]),
  };

  constructor(options: IBContextOptions) {
    super();

    this.options = options;
    IBContext.setupHook.call(this, this.options);

    // setup core interactions, after all plugins

    setupInteractionKeydown(this);
    setupInteractionSelectFocus(this);
  }

  dispose() {
    this.blocks.forEach(block => block.dispose());
    this.slots.forEach(slot => slot.dispose());

    this.emit("dispose", this);
    this.hooks.dispose.call(this);
  }

  blocks = new Set<IBBlock>();
  slots = new Set<IBSlot>();

  hasFocus = false;
  selectedBlocks: Set<IBBlock> = new Set<IBBlock>();
  selectedSlot: IBSlot | null = null;

  /**
   * update selection and emit "statusChange" event on both new/old slots/blocks
   *
   * @returns - selection has changed or not
   */
  selectBlock(
    block: MaybeArray<IBBlock>,
    multipleSelect?: MultipleSelectType,
    preferredSlot?: IBSlot | null,
    clearPrevSelection?: boolean
  ): boolean {
    const changes = updateSelection(this, block, multipleSelect, preferredSlot, clearPrevSelection);
    return emitSelectionChangeEvents(this, changes);
  }

  /**
   * @returns - selection has changed or not
   */
  selectSlot(
    slot: IBSlot,
    blockSelection: "ownerBlock" | "children" = "children"
  ) {
    if (!slot) return false;

    const getChanges = startDiffSelection(this);

    this.selectedSlot = slot;
    this.selectedBlocks.clear();

    if (blockSelection === "children") {
      for (const block of slot.children) {
        this.selectedBlocks.add(block);
        if (!(this.options.multipleSelect ?? true)) break;
      }
    }

    if (blockSelection === "ownerBlock") {
      if (slot.parent) this.selectedBlocks.add(slot.parent);
    }

    return emitSelectionChangeEvents(this, getChanges());
  }
}
