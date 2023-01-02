import { EventEmitter } from "./EventEmitter";
import { IBPasteAction, IBCutAction, IBClipboardData, isIBClipboardData, IBMoveInSlotAction, IBMoveBetweenSlotsAction } from "./action";
import { BlockHandler, BlockInfo } from "./BlockHandler";
import { DraggingContext } from "./DraggingContext";
import { find, head } from "./itertools";
import { SlotHandler, SlotInfo } from "./SlotHandler";
import { MultipleSelectType, normalizeMultipleSelectType } from "./MultipleSelectType";

export interface BlockContextEvents {
  activeElementChanged(ctx: BlockContext): void;
  focus(ctx: BlockContext): void;
  blur(ctx: BlockContext): void;
  paste(action: IBPasteAction): void;
  cut(action: IBCutAction): void;
  moveInSlot(action: IBMoveInSlotAction): void;
  moveBetweenSlots(action: IBMoveBetweenSlotsAction): void;
}

export interface BlockContextOptions {
  /**
   * optional, a string to distinguish BlockContexts of different scenario usage.
   *
   * for example: "files", "workflow", "tasks", "dependencies"
   *
   * between BlockContexts with different brand, data cannot be pasted / dragged
   */
  brand?: string;

  /**
   * whether unset all active blocks & slot's `active` state when click nothing on the page
   *
   * default is true
   */
  deactivateHandlersWhenBlur?: boolean;

  /**
   * whether navigate with arrow keys when focused.
   *
   * default is true.
   *
   * Note: to add your own keyboard logic, `blockContext.hiddenInput.addEventListener("keydown", ...)`
   */
  navigateWithArrowKeys?: boolean;

  /**
   * when user press delete key, whether perform cut action without updating clipboard.
   *
   * default is true.
   *
   * Note: to add your own keyboard logic, `blockContext.hiddenInput.addEventListener("keydown", ...)`
   */
  handleDeleteKey?: boolean;

  /**
   * default is true
   */
  multipleSelect?: boolean;

  /**
   * default is `JSON.stringify(data)`
   *
   * @see {@link unserializeForClipboard}
   */
  serializeForClipboard?: (data: any) => string;

  /**
   * default is `JSON.parse(text)`
   *
   * @see {@link serializeForClipboard}
   */
  unserializeForClipboard?: (text: string) => any;
}

const defaultOptions: Required<BlockContextOptions> = {
  brand: "",
  deactivateHandlersWhenBlur: true,
  navigateWithArrowKeys: true,
  handleDeleteKey: true,
  multipleSelect: true,
  serializeForClipboard: (data: any) => JSON.stringify(data),
  unserializeForClipboard: (text: string) => JSON.parse(text),
};

export class BlockContext extends EventEmitter<BlockContextEvents> {
  hiddenInput: HTMLTextAreaElement;
  private _lastActiveElement: HTMLElement | Element | null = null;

  hasFocus = false;
  options: Required<BlockContextOptions>;

  brand = "";
  uuid = `${Date.now().toString(36)}-${Math.random().toString(36)}`;
  dragging = new DraggingContext(this);

  constructor(options: BlockContextOptions = {}) {
    super();
    this.options = { ...defaultOptions, ...options };
    this.brand = String(this.options.brand);

    document.addEventListener("pointerup", this.handleGlobalPointerUp, false);

    const hiddenInput = this.hiddenInput = document.createElement("textarea");
    hiddenInput.style.cssText = "opacity:0;left:0;top:0;position:fixed;width:2px;height:2px";
    hiddenInput.tabIndex = -1;
    hiddenInput.inputMode = "none";
    hiddenInput.ownerDocument.body.appendChild(hiddenInput);

    const populateClipboard = (ev: ClipboardEvent) => {
      const text = this.options.serializeForClipboard(this.dumpSelectedData());
      if (!text) return;

      ev.preventDefault();
      ev.clipboardData?.setData("text/plain", text);
    };
    hiddenInput.addEventListener("copy", (ev) => {
      populateClipboard(ev);
    }, false);
    hiddenInput.addEventListener("cut", (ev) => {
      populateClipboard(ev);
      this.deleteActiveBlocks();
    }, false);
    hiddenInput.addEventListener("paste", (ev) => {
      ev.preventDefault();

      // const info = this.activeElementInfo;
      // if (info?.type !== "block") return;

      try {
        const text = ev.clipboardData?.getData("text/plain");
        if (!text) return;

        const data = this.options.unserializeForClipboard(text);
        this.pasteWithData(data);
      } catch (err) {
        console.error("Failed to paste!", err);
      }
    }, false);
    hiddenInput.addEventListener("focus", () => {
      this.hasFocus = true;
      this.emit("focus", this);
      this.activeBlocks.forEach(block => block.info.onStatusChange?.(block));
      this.activeSlot?.info.onStatusChange?.(this.activeSlot);
    }, false);
    hiddenInput.addEventListener("blur", () => {
      this.hasFocus = false;
      this._lastActiveElement = null;
      this.emit("blur", this);
      this.activeBlocks.forEach(block => block.info.onStatusChange?.(block));
      this.activeSlot?.info.onStatusChange?.(this.activeSlot);
    }, false);
    hiddenInput.addEventListener("keydown", (ev) => {
      const opts = this.options;

      switch (ev.code) {
        case "KeyA":
          if (opts.multipleSelect && (ev.ctrlKey || ev.metaKey)) {
            this.activeBlocks = new Set(
              Array
                .from(this.slotOfActiveBlocks?.items || this.activeSlot?.items || [])
                .sort((a, b) => a.index - b.index)
            );
            this.syncActiveElementStatus();
          }
          break;

        case "ArrowUp":
          if (opts.navigateWithArrowKeys) this.activeNextBlock(-1, ev.shiftKey || ev.ctrlKey || ev.metaKey);
          break;

        case "ArrowDown":
          if (opts.navigateWithArrowKeys) this.activeNextBlock(+1, ev.shiftKey || ev.ctrlKey || ev.metaKey);
          break;

        case "ArrowLeft":
          if (opts.navigateWithArrowKeys) this.activeParentBlock();
          break;

        case "ArrowRight":
          if (opts.navigateWithArrowKeys) this.activeChildrenBlocks();
          break;

        case "Delete":
        case "Backspace":
          if (opts.handleDeleteKey) this.deleteActiveBlocks();
          break;

        case "Tab":
          {
            const el = this._lastActiveElement;
            if (el && "focus" in el) {
              const nextEl = (el.tabIndex === -1) && el.querySelector("[tabIndex], button, textarea, input, select, a, [contentEditable]") as HTMLElement;
              if (!nextEl || !("focus" in nextEl)) el.focus();
              else nextEl.focus();
            }
            ev.preventDefault();
          }
          break;
      }
    }, false);
  }

  focus() {
    if (document.activeElement === this.hiddenInput) return;
    // if (this.activeBlocks.size == 0 && !this.activeSlot) return;

    this._lastActiveElement = document.activeElement;
    this.hiddenInput.focus();
  }

  /**
   * dump all active blocks' data, then you can transfer it via file / clipboard etc,
   * and use it with {@link pasteWithData}
   *
   * this will NOT delete the selected blocks. if you want to, call {@link deleteActiveBlocks}
   *
   * @see {@link pasteWithData}
   * @returns `undefined` if cannot copy. otherwise returns text
   */
  dumpSelectedData() {
    const data: IBClipboardData = {
      isIBClipboardData: true,
      ibContextBrand: this.brand,
      ibContextUUID: this.uuid,
      blocksData: [],
    };

    this.activeBlocks.forEach(block => {
      data.blocksData.push(block.data);
    });

    // nothing to copy?
    if (data.blocksData.length === 0) return;

    return data;
  }

  /**
   * Focus the hidden input and write selected blocks' data to the clipboard.
   */
  copy() {
    this.hiddenInput.focus();
    document.execCommand("copy");
  }

  /**
   * do a "pasting" action with the data exported by {@link dumpSelectedData}
   *
   * @param data
   * @param targetIndex - the insert point. if not specified, will be before the active block, of the end of current active slot.
   * @see {@link dumpSelectedData}
   */
  pasteWithData(data: any, targetIndex?: number) {
    if (!isIBClipboardData(data, this.brand)) throw new Error("Need a valid IBClipboardData object");

    const slot = this.activeSlot;
    if (!slot) return;

    const activeBlock = head(this.activeBlocks);
    const index = targetIndex ?? (
      slot === activeBlock?.ownerSlot
        ? activeBlock.index  // insert before current selected
        : Math.max(0, ...Array.from(slot.items.values(), x => 1 + x.index)) // insert after last item inside slot
    );

    // ----------------------------
    // event "paste"

    const action = new IBPasteAction({
      type: "paste",
      ctx: this,
      data,
      slot,
      index,
    });
    slot.info.onPaste?.(action);
    this.emit("paste", action);

    if (action.returnValue === false) return;


    // ----------------------------
    // active new blocks

    setTimeout(() => {
      // auto select the new block, if created
      // TODO: use subscriber instead of timer
      const maxIndex = data.blocksData.length + index - 1;
      const newBlocks = Array.from(slot.items).filter(block => block.index >= index && block.index <= maxIndex);
      if (newBlocks.length) {
        this.activeSlot = slot;
        this.activeBlocks.clear();
        newBlocks.forEach(block => this.activeBlocks.add(block));
        this.syncActiveElementStatus();
      }
    }, 100);
  }

  /**
   * Make a Cut Action and send to activeSlot.
   *
   * `cut` event will be emitted on the slot and this context.
   *
   * clipboard not affected. Call `copy` before this, if needed.
   *
   * @return `true` if action is handled and not `preventDefault`-ed
   */
  deleteActiveBlocks() {
    const blocks = Array.from(this.activeBlocks.values());

    const slot = blocks[0]?.ownerSlot;
    if (!slot) return false;

    const block0index = blocks[0]!.index;
    const indexes=Array.from(blocks, x => x.index);

    const action = new IBCutAction({
      type: "cut",
      blocks,
      indexes,
      indexesDescending: indexes.slice().sort((a, b) => b - a),
      ctx: this,
      slot,
    });

    slot.info.onCut?.(action);
    this.emit("cut", action);

    // if successful cut, select the next block
    if (action.returnValue) {
      const nextBlock = find(slot.items, x => x.index === block0index);
      if (nextBlock) this.addBlockToSelection(nextBlock);
    }
    return action.returnValue;
  }

  /**
   * Focus the hidden input and select next n-th block.
   *
   * @param n the relative number to current block. could be negative
   */
  activeNextBlock(n: number, multipleSelectMode = false) {
    const multipleSelect = multipleSelectMode && this.options.multipleSelect;
    this.focus();

    let somethingWasSelected = true;
    let blocks = Array.from(this.activeBlocks);
    if (!blocks.length) {
      // no block is selected
      // try select someone inside current slot
      blocks = Array.from(this.activeSlot?.items || []);
      somethingWasSelected = false;

      // still nothing inside? do nothing
      if (!blocks.length) return;
    }

    const slot = blocks[0]!.ownerSlot;
    let maxIdx = blocks[0]!.index, minIdx = maxIdx;
    let maxBlk = blocks[0]!, minBlk = maxBlk;

    blocks.slice(1).forEach(block => {
      if (block.ownerSlot !== slot) return;

      const index = block.index;
      if (index > maxIdx) { maxIdx = index; maxBlk = block; }
      if (index < minIdx) { minIdx = index; minBlk = block; }
    });

    const index = n > 0 ? (maxIdx + n) : (minIdx + n);
    const newBlock = find(slot?.items, x => x.index === index);

    if (!newBlock) {
      if (somethingWasSelected) {
        // something was selected
        if (!multipleSelect) {
          this.activeBlocks.clear();
          if (blocks.length > 1) {
            // collapse to single selection
            if (n > 0) this.activeBlocks.add(maxBlk);
            else this.activeBlocks.add(minBlk);
          }
          this.syncActiveElementStatus();
        }
      } else {
        // nothing was selected
        this.activeBlocks.clear();
        if (multipleSelect) blocks.forEach(b => this.activeBlocks.add(b));
        else if (n > 0) this.activeBlocks.add(minBlk);
        else this.activeBlocks.add(maxBlk);
        this.syncActiveElementStatus();
      }

      return;
    }

    if (!multipleSelect) this.activeBlocks.clear();
    this.activeBlocks.add(newBlock);
    this.activeSlot = slot;
    this.syncActiveElementStatus();
  }

  /**
   * Focus the hidden input and select parent block of current block.
   */
  activeParentBlock() {
    const newBlock = this.activeSlot?.ownerBlock;
    const newSlot = newBlock?.ownerSlot;

    this.activeSlot = newSlot || null;
    this.activeBlocks.clear();
    if (newBlock) this.activeBlocks.add(newBlock);
    this.syncActiveElementStatus();
  }

  /**
   * Focus the hidden input and select current block's first slot and its children.
   */
  activeChildrenBlocks() {
    const block = head(this.activeBlocks);
    const slot = head(block?.slots);
    if (!slot) return;

    this.activeSlot = slot;
    this.activeBlocks.clear();
    if (this.options.multipleSelect) {
      slot.items.forEach(block => this.activeBlocks.add(block));
    } else {
      const block = head(slot.items);
      if (block) this.activeBlocks.add(block);
    }
    this.syncActiveElementStatus();
  }

  /**
   * the current active blocks.
   *
   * WARN:
   * 1. they must be in the same slot!
   * 2. always invoke `syncActiveElementStatus` after mutating this.
   */
  activeBlocks = new Set<BlockHandler>();
  slotOfActiveBlocks: SlotHandler | null = null;

  /**
   * the current active slot.
   *
   * WARN:
   * 1. this is NOT ALWAYS related to `activeBlocks`. See `slotOfActiveBlocks` if needed.
   * 2. always invoke `syncActiveElementStatus` after mutating this.
   */
  activeSlot: SlotHandler | null = null;
  private lastActiveSlot: SlotHandler | null = null;
  private lastActiveBlocks?: Set<BlockHandler>;

  /**
   * invoke this when `activeSlot` or `activeBlocks` are mutated!
   */
  syncActiveElementStatus() {
    let hasChanges = false;
    const lastBlocks = this.lastActiveBlocks;
    const lastSlot = this.lastActiveSlot;

    const activeBlocksArray = Array.from(this.activeBlocks);
    const slotOfBlocks = activeBlocksArray[0]?.ownerSlot || null;

    if (activeBlocksArray.length > 1 && slotOfBlocks !== this.activeSlot) {
      // if multiple blocks are selected, enforce the ownerSlot is active
      this.activeSlot = slotOfBlocks;
    }

    if (!this.activeSlot && slotOfBlocks) {
      // always active one slot
      this.activeSlot = slotOfBlocks;
    }

    activeBlocksArray.forEach((item, index) => {
      lastBlocks?.delete(item);
      hasChanges = item._maybeUpdateActiveNumber(index) || hasChanges;
    });

    lastBlocks?.forEach(item => {
      hasChanges = item._maybeUpdateActiveNumber(false) || hasChanges;
    });

    if (this.activeSlot !== lastSlot) {
      lastSlot?._maybeUpdateActive(false);
      this.activeSlot?._maybeUpdateActive(true);
      this.lastActiveSlot = this.activeSlot;
      hasChanges = true;
    }

    this.lastActiveBlocks = new Set(this.activeBlocks);
    this.slotOfActiveBlocks = slotOfBlocks;

    if (hasChanges) this.emit("activeElementChanged", this);
  }

  isFocusingBlock?: BlockHandler;
  isFocusingSlot?: SlotHandler;

  /**
   * clear selection
   */
  clearSelection() {
    this.activeBlocks.clear();
    this.activeSlot = null;
    this.syncActiveElementStatus();
  }

  /**
   * select a block or add it to selection ( if multipleSelect is not `none`)
   *
   * note: if in multipleSelect mode, `activeSlot` will be affected
   */
  addBlockToSelection(
    currBlock: BlockHandler,
    multipleSelect?: MultipleSelectType
  ): void {
    multipleSelect = normalizeMultipleSelectType(multipleSelect);
    if (!this.options.multipleSelect) multipleSelect = "none";

    if (multipleSelect === "none") {
      // single selection
      this.activeBlocks.clear();
      this.activeBlocks.add(currBlock);
    } else {
      // multipleSelect, ensure every active block is in same slot.
      const headBlock = head(this.activeBlocks);
      if (headBlock && headBlock.ownerSlot !== currBlock.ownerSlot) {
        // they are not in same slot
        // find the nearest common slot

        const ownerSlotStackOfHead = [] as SlotHandler[];
        for (let i: BlockHandler | null = headBlock; i && i.ownerSlot;) {
          ownerSlotStackOfHead.push(i.ownerSlot);
          i = i.ownerSlot.ownerBlock;
        }

        let depth = -1;
        for (let i: BlockHandler | null = currBlock; i && i.ownerSlot; i = i.ownerSlot.ownerBlock) {
          if ((depth = ownerSlotStackOfHead.indexOf(i.ownerSlot)) !== -1) {
            currBlock = i;  // find the common slot, and currBlock shall be itself or its ancestor
            break;
          }
        }

        if (depth === -1) {
          // no common slot found
          this.activeBlocks.clear();
        } else if (depth > 0) {
          // found common slot (and currBlock might has been replaced)
          // however, because depth > 0, activeBlocks must be replaced to their ancestor,
          // so that we can align blocks to the same ownerSlot
          this.activeBlocks = new Set(Array.from(this.activeBlocks, b => {
            for (let j = depth; j > 0; j--, b = b.ownerSlot!.ownerBlock!);
            return b;
          }));
        }
      }

      // not currBlock and activeBlocks are updated
      // we just use the correct slot as activeSlot
      this.activeSlot = currBlock.ownerSlot || null;

      // special case: if the ownerSlot is null (anonymous root slot)
      // we cannot make continuous selection
      // and `multipleSelect` shall be fixed to "ctrl"
      if (!this.activeSlot) multipleSelect = "ctrl";
    }

    if (multipleSelect === "ctrl") {
      // discontinuous multiple-selection
      if (this.activeBlocks.has(currBlock)) this.activeBlocks.delete(currBlock);
      else this.activeBlocks.add(currBlock);
    }

    if (multipleSelect === "shift") {
      // continuous selection

      // at this moment slot is guranteed as not-null
      // because multipleSelect has been fixed above
      const slot = this.activeSlot!;

      const currIndex = currBlock.index;
      let minIndex = currIndex, maxIndex = currIndex;

      this.activeBlocks.forEach(block => {
        const index = block.index;
        if (minIndex > index) minIndex = index;
        if (maxIndex < index) maxIndex = index;
      });

      // make a continuous selection

      this.activeBlocks = new Set(
        Array
          .from(slot.items)
          .filter(block => {
            const index = block.index;
            return (index >= minIndex && index <= maxIndex);
          })
          .sort((a, b) => a.index - b.index)
      );
    }

    this.syncActiveElementStatus();
  }

  handleSlotPointerUp = (slot: SlotHandler, ev?: Pick<PointerEvent, "eventPhase">) => {
    const isCapture = ev && ev.eventPhase === Event.CAPTURING_PHASE;
    if (!isCapture && this.isFocusingSlot) return;  // in bubble phase: only update isFocusingSlot once
    this.isFocusingSlot = slot;
  };

  handleBlockPointerUp = (block: BlockHandler, ev?: Pick<PointerEvent, "eventPhase">) => {
    const isCapture = ev && ev.eventPhase === Event.CAPTURING_PHASE;
    if (!isCapture && this.isFocusingBlock) return;  // in bubble phase: only update isFocusingBlock once
    this.isFocusingBlock = block;
  };

  handleGlobalPointerUp = (ev: PointerEvent) => {
    const currBlock = this.isFocusingBlock;
    const currSlot = this.isFocusingSlot;
    this.isFocusingBlock = void 0;
    this.isFocusingSlot = void 0;

    if (!currBlock) {
      // nothing was clicked
      this.activeSlot = currSlot || null;
      if (this.options.deactivateHandlersWhenBlur && this.activeBlocks.size > 0) {
        this.activeBlocks.clear();
      }
    } else {
      this.activeSlot = currSlot || null;
      this.addBlockToSelection(currBlock, ev);
    }

    this.syncActiveElementStatus();
  };

  dispose() {
    this.dragging.dispose();
    this.hiddenInput.parentElement?.removeChild(this.hiddenInput);
    document.removeEventListener("pointerup", this.handleGlobalPointerUp, false);
  }

  createBlock(info: BlockInfo, ownerSlot: SlotHandler | null = null) {
    return new BlockHandler(this, ownerSlot, info);
  }

  createSlot(info: SlotInfo, ownerBlock: BlockHandler | null = null) {
    return new SlotHandler(this, ownerBlock, info);
  }
}
