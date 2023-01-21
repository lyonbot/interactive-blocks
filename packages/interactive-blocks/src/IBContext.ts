import { TypedEmitter } from "tiny-typed-emitter";
import { SyncHook, SyncBailHook } from "tapable";
import { IBContextEvents, IBContextOptions } from "./definitions";
import { MultipleSelectType, normalizeMultipleSelectType } from "./utils/multiple-select";
import { IBBlock, IBElement, IBSlot } from "./IBElement";
import { emitSelectionChangeEvents, startDiffSelection, updateSelection } from "./core-internals/selection";
import { setupInteractionSelectFocus } from "./core-internals/interaction-select-focus";
import { setupInteractionKeydown } from "./core-internals/interaction-keydown";
import { MaybeArray, toArray } from "./utils/array";
import { head } from "./utils/iter";
import { insertBlocks, removeBlocks } from "./core-internals/commands";
import { isContextMultipleSelect } from "./core-internals/defaults";
import { toBlockArray } from "./core-internals/relation";
import { isFocusable } from "./utils/dom";

export class IBContext extends TypedEmitter<IBContextEvents> {
  static setupHook = new SyncHook<[IBContext, IBContextOptions]>(["context", "options"]);

  options: IBContextOptions;
  domRoot: Document | ShadowRoot;
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
    this.domRoot = options.domRoot || document;
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

  dom2el = new WeakMap<HTMLElement, IBElement>();

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
    return !!emitSelectionChangeEvents(this, changes);
  }

  /**
   * @returns - selection has changed or not
   */
  selectSlot(
    slot: IBSlot,
    selectChildren?: boolean
  ) {
    if (!slot) return false;

    const getChanges = startDiffSelection(this);

    this.selectedSlot = slot;
    this.selectedBlocks.clear();

    if (selectChildren) {
      for (const block of slot.children) {
        this.selectedBlocks.add(block);
        if (!isContextMultipleSelect(this)) break;
      }
    }

    if (!this.selectedBlocks.size) {
      if (slot.parent) this.selectedBlocks.add(slot.parent);
    }

    return !!emitSelectionChangeEvents(this, getChanges());
  }

  /**
   * remove selected blocks
   */
  async remove() {
    const slot = head(this.selectedBlocks)?.parent;
    const indexes = Array.from(this.selectedBlocks, b => b.index);
    await removeBlocks(slot, indexes);
  }

  /**
   * insert data to the selected slot
   */
  async insert(blockData: any[] | any) {
    await insertBlocks(this.selectedSlot, blockData);
  }

  /**
   * navigate and select block, like pressing arrowUp or arrowDown key
   */
  navigateInSlot(direction: "up" | "down", multipleSelect?: MultipleSelectType) {
    const slot = this.selectedSlot;
    if (!slot) return;

    const children = toBlockArray(slot.children);
    if (!children.length) {
      const ownerBlock = slot.parent;
      if (!ownerBlock) return;

      this.selectedSlot = ownerBlock.parent || null;
      emitSelectionChangeEvents(this, { slots: [slot, this.selectedSlot] });
      return;
    }

    // ----------------------------------------------------------------
    // find the block to be selected

    let block: IBBlock | undefined;
    if (direction === "up") {
      block = children[children.length - 1]?.block;
      for (let index = 0; index < children.length; index++) {
        const element = children[index]!;
        if (element.isSelected) {
          block = children[index - 1]?.block;
          break;
        }
      }
    }
    if (direction === "down") {
      block = children[0]?.block;
      for (let index = children.length - 1; index >= 0; index--) {
        const element = children[index]!;
        if (element.isSelected) {
          block = children[index + 1]?.block;
          break;
        }
      }
    }

    // ----------------------------------------------------------------
    // found the block! update selection

    const mul = normalizeMultipleSelectType(multipleSelect);
    this.selectBlock(block, mul === "none" ? "none" : "ctrl", slot);

    // ---------------------------------------------------------------
    // UX secret: move focus to the block element, potentially scroll the window

    if (block && isFocusable(block.domElement)) {
      block.domElement.focus();
    }
  }
}
