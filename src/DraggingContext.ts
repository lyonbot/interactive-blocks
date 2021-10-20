import { BlockHandler } from "./BlockHandler";
import { SlotHandler } from "./SlotHandler";
import { BlockContext } from "./BlockContext";
import { EventKeyStyle, getStyledEventHandlersLUT, throttle } from "./utils";
import { EventEmitter } from "./EventEmitter";
import { IBMoveBetweenSlotsAction, IBMoveInSlotAction, IBSlotBeforeDropAction } from "./action";
import { reduce } from "./itertools";
import { IBBlockDragStartAction } from "./action";

const isWebKit = "webkitRequestAnimationFrame" in window;
const MIME_CTX_UUID = "x-block-context/uuid";
const MIME_CTX_BRAND_LEADING = "x-block-context/brand-";

const multipleSelectDragImage = document.createElement("div");
multipleSelectDragImage.style.cssText = "position:fixed;pointer-events:none;left:0;top:0;background: #FFF; border: 1px solid #000; padding: 4px 8px;transform:translate(-50%, -50%)";

export interface DraggingContextEvents {
  /** fires when one of `hoveringSlot`, `hoveringBlock` or `isHovering` changes */
  hoverChanged(ctx: BlockContext): void;

  /** fires when start dragging a block */
  blockDragStart(action: IBBlockDragStartAction): void;

  slotBeforeDrop(action: IBSlotBeforeDropAction): void;
}

export interface ComputeIndexToDropRequest {
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
  currentTarget: HTMLElement;

  ctx: BlockContext;
  slot: SlotHandler;
  isDraggingFromCurrentCtx: boolean;
  /** if drag source is from current BlockContext, this will be the array of current dragging blocks */
  draggingBlocks?: readonly BlockHandler[];
  /** the original dataTransfer object from DragEvent */
  dataTransfer: DataTransfer | null;
  dropEffect: "none" | "copy" | "link" | "move";
}

declare module "./SlotHandler" {
  interface SlotInfo {
    /**
     * for drag-n-drop
     */
    onMoveInSlot?(action: IBMoveInSlotAction): void;

    /**
     * for drag-n-drop
     */
    onMoveToThisSlot?(action: IBMoveBetweenSlotsAction): void;

    /**
     * for drag-n-drop
     *
     * fires when `isDragHovering` or `indexToDrop` change
     */
    onDragHoverStatusChange?(ctx: BlockContext): void;

    /**
     * for drag-n-drop
     *
     * check if this slot is droppable and compute the insert position.
     *
     * returns:
     *
     * - `false` to prevent dropping,
     * - `undefined` to use auto-computed position (which might not accurate),
     * - index number
     */
    computeIndexToDrop?(req: ComputeIndexToDropRequest): number | false | void;
  }

  interface SlotHandler {
    isDragHovering?: boolean;
    /** the position to drop. only available when `isDragHovering` */
    indexToDrop?: number | undefined;
  }
}

declare module "./BlockHandler" {
  interface BlockInfo {
    onDragStart?(action: IBBlockDragStartAction): void;
  }
}

export class DraggingContext extends EventEmitter<DraggingContextEvents> {
  ctx: BlockContext;

  draggingBlocks: Array<BlockHandler> | undefined;
  slotOfDraggingBlocks: SlotHandler | undefined;

  isHovering = false;
  hoveringSlot: SlotHandler | undefined;
  hoveringBlock: BlockHandler | undefined;
  /** available when isHovering */
  dropEffect?: "none" | "copy" | "link" | "move";

  constructor(ctx: BlockContext) {
    super();
    this.ctx = ctx;
  }

  dispose(): void {
    this.removeAllListeners();
    this.setHoveringSlot.cancel();
  }

  private setHoveringSlot = throttle(this._originalSetHoveringSlot.bind(this), 50);

  private _originalSetHoveringSlot(slot: SlotHandler, indexToDrop: number): void;
  private _originalSetHoveringSlot(slot: undefined): void;
  private _originalSetHoveringSlot(slot: SlotHandler | undefined, indexToDrop?: number) {
    if (slot && typeof indexToDrop !== "number") throw new Error("Cannot setHoveringSlot with indexToDrop unknown");

    if (slot === this.hoveringSlot) {
      if (slot && slot.indexToDrop !== indexToDrop) {
        slot.indexToDrop = indexToDrop;
        slot.info.onDragHoverStatusChange?.(this.ctx);
        this.emit("hoverChanged", this.ctx);
      }
      return;
    }

    const lastSlot = this.hoveringSlot;

    if (this.hoveringBlock?.ownerSlot !== slot) this.hoveringBlock = void 0;
    this.hoveringSlot = slot;
    this.isHovering = !!slot;

    if (lastSlot) {
      lastSlot.isDragHovering = false;
      lastSlot.indexToDrop = undefined;
      lastSlot.info.onDragHoverStatusChange?.(this.ctx);
    }

    if (slot) {
      slot.isDragHovering = true;
      slot.indexToDrop = indexToDrop;
      slot.info.onDragHoverStatusChange?.(this.ctx);
    }

    this.emit("hoverChanged", this.ctx);
  }

  // -----------------------------------

  getDefaultBlockEventHandlers<T extends EventKeyStyle>(block: BlockHandler, style: T) {
    return getStyledEventHandlersLUT({
      dragStart: this.handleBlockDragStart.bind(this, block),
      dragEnd: this.handleBlockDragEnd.bind(this, block),
      dragOver: this.handleBlockDragOver.bind(this, block),
      dragLeave: this.handleBlockDragLeave.bind(this, block),
    }, style);
  }

  handleBlockDragStart(block: BlockHandler, ev: DragEvent) {
    const dataTransfer = ev.dataTransfer;
    if (!dataTransfer) return;

    if (!this.ctx.activeBlocks.has(block)) this.ctx.addBlockToSelection(block, "none");

    const text = this.ctx.getTextForClipboard();
    if (!text) return;

    const blocks = Array.from(this.ctx.activeBlocks);
    const action = new IBBlockDragStartAction({
      type: "blockDragStart",
      text,
      blocks,
      ctx: this.ctx,
      currentBlock: block,
      dataTransfer,
      event: ev,
    });

    block.info.onDragStart?.(action);
    this.emit("blockDragStart", action);
    if (action.returnValue === false) return;  // prevented

    // -----------------
    // start process stuff!

    ev.stopPropagation();

    dataTransfer.setData("text/plain", action.text);
    dataTransfer.setData(MIME_CTX_UUID, this.ctx.uuid);
    dataTransfer.setData(`${MIME_CTX_BRAND_LEADING}${this.ctx.brand}`, "true");
    if (blocks.length > 1) {
      document.body.appendChild(multipleSelectDragImage);
      multipleSelectDragImage.style.left = `${ev.clientX}px`;
      multipleSelectDragImage.style.top = `${ev.clientY}px`;
      setTimeout(() => multipleSelectDragImage.remove(), 100);

      multipleSelectDragImage.textContent = `${blocks.length} items`;
      dataTransfer.setDragImage(multipleSelectDragImage, multipleSelectDragImage.offsetWidth / 2, multipleSelectDragImage.offsetHeight / 2);
    }

    const slot = this.ctx.slotOfActiveBlocks;
    this.draggingBlocks = blocks;
    this.slotOfDraggingBlocks = slot || void 0;
    if (slot) {
      this.setHoveringSlot(slot, block.index);
      this.setHoveringSlot.flush();
    }
  }

  handleBlockDragEnd(block: BlockHandler, ev: DragEvent) {
    this.slotOfDraggingBlocks = void 0;
    this.draggingBlocks = void 0;
    this.setHoveringSlot(void 0);
  }

  handleBlockDragOver(block: BlockHandler) {
    if (this.hoveringBlock === block) return;
    if (block.ownerSlot != this.hoveringSlot) return; // eslint-disable-line eqeqeq

    this.hoveringBlock = block;
    this.emit("hoverChanged", this.ctx);
  }

  handleBlockDragLeave(block: BlockHandler) {
    if (this.hoveringBlock !== block) return;
    this.hoveringBlock = void 0;
    this.emit("hoverChanged", this.ctx);
  }

  // -----------------------------------

  getDefaultSlotEventHandlers<T extends EventKeyStyle>(slot: SlotHandler, style: T) {
    return getStyledEventHandlersLUT({
      dragOver: (ev: DragEvent) => {
        if (!this.handleSlotDragOver(slot, ev)) return;

        ev.preventDefault();
        ev.stopPropagation();
      },

      dragLeave: (ev: DragEvent) => {
        this.handleSlotDragLeave(slot);

        ev.preventDefault();
        ev.stopPropagation();
      },

      drop: (ev: DragEvent) => {
        this.handleSlotDrop(slot, ev);

        ev.preventDefault();
        ev.stopPropagation();
      },
    }, style);
  }

  handleSlotDragOver(slot: SlotHandler, ev: DragEvent) {
    // if dragSource is a BlockContext, check the brand of BlockContext
    if (
      ev.dataTransfer?.types.includes(MIME_CTX_UUID) &&
      !ev.dataTransfer.types.includes(`${MIME_CTX_BRAND_LEADING}${this.ctx.brand}`)
    ) return false;

    const indexToDrop = this.computeIndexToDrop(slot, ev);
    if (indexToDrop === false) return false; // not droppable

    this.setHoveringSlot(slot, indexToDrop);
    return true;
  }

  handleSlotDrop(slot: SlotHandler, ev: DragEvent) {
    const indexToDrop = this.computeIndexToDrop(slot, ev);
    if (indexToDrop === false) return; // not droppable

    const dropEffect = this.dropEffect!;
    const blocks = this.draggingBlocks;
    const ctx = this.ctx;

    // -------------------

    const beforeDropAction = new IBSlotBeforeDropAction({
      type: "slotBeforeDrop",
      ctx,
      slot,
      dropEffect,
      dataTransfer: ev.dataTransfer!,
      event: ev,
      indexToDrop,
      isDraggingFromCurrentCtx: !!blocks,
      draggingBlocks: blocks,
    });
    this.emit("slotBeforeDrop", beforeDropAction);
    if (beforeDropAction.returnValue === false) {
      this.setHoveringSlot(void 0);
      this.setHoveringSlot.flush();
      return;
    }

    // -------------------

    this.setHoveringSlot(slot, indexToDrop);
    this.setHoveringSlot.flush();

    if (!blocks || dropEffect === "copy") {
      // drop from outside, or is copying
      try {
        const data = JSON.parse(ev.dataTransfer!.getData("text/plain"));
        ctx.activeSlot = slot;
        ctx.activeBlocks.clear();
        ctx.syncActiveElementStatus();
        ctx.pasteWithData(data, indexToDrop);
        ctx.focus();
      } catch (e) {
        console.error("Failed to drop");
      }
    } else if (slot === ctx.slotOfActiveBlocks) {
      // move in same slot
      const index = indexToDrop - blocks.filter(x => x.index < indexToDrop).length;

      const action = new IBMoveInSlotAction({
        type: "moveInSlot",
        blocks,
        ctx,
        slot,
        index,
      });

      slot.info.onMoveInSlot?.(action);
      ctx.emit("moveInSlot", action);
      if (!action.returnValue) return;

      setTimeout(() => {
        ctx.activeSlot = slot;
        ctx.activeBlocks.clear();
        slot.items.forEach(block => {
          const bi = block.index;
          if (bi >= index && bi < index + blocks.length) ctx.activeBlocks.add(block);
        });
        ctx.syncActiveElementStatus();
        ctx.focus();
      }, 100);
    } else {
      // move between slots
      const index = indexToDrop;
      const action = new IBMoveBetweenSlotsAction({
        type: "moveBetweenSlots",
        blocks,
        ctx,
        fromSlot: ctx.slotOfActiveBlocks,
        toSlot: slot,
        index,
      });

      slot.info.onMoveToThisSlot?.(action);
      ctx.emit("moveBetweenSlots", action);
      if (!action.returnValue) return;

      setTimeout(() => {
        ctx.activeSlot = slot;
        ctx.activeBlocks.clear();
        slot.items.forEach(block => {
          const bi = block.index;
          if (bi >= index && bi < index + blocks.length) ctx.activeBlocks.add(block);
        });
        ctx.syncActiveElementStatus();
        ctx.focus();
      }, 100);
    }

    this.setHoveringSlot(void 0);
  }

  handleSlotDragLeave(slot: SlotHandler) {
    this.setHoveringSlot(void 0);
  }

  /**
   * side effect: update this.dropEffect
   *
   * @return false means not droppable. otherwise a number is returned.
   */
  computeIndexToDrop(slot: SlotHandler, ev: DragEvent): false | number {
    let origDropEffect = ev.dataTransfer!.dropEffect;
    // deal with chromium bug: dropEffect is incorrect
    if (origDropEffect === "none" && isWebKit) origDropEffect = (ev.ctrlKey || ev.altKey) ? "copy" : "move";
    this.dropEffect = origDropEffect;

    // not droppable? return false
    if (this.dropEffect !== "copy" && this.draggingBlocks?.some(block => slot.isDescendantOfBlock(block))) {
      return false;
    }

    // maybe droppable, compute it
    const fnAns = slot.info.computeIndexToDrop?.({
      ctx: this.ctx,
      slot,
      isDraggingFromCurrentCtx: !!this.draggingBlocks,
      draggingBlocks: this.draggingBlocks,
      dataTransfer: ev.dataTransfer,
      dropEffect: this.dropEffect!,

      currentTarget: ev.currentTarget as HTMLElement,
      clientX: ev.clientX,
      clientY: ev.clientY,
      offsetX: ev.offsetX,
      offsetY: ev.offsetY,
    });

    if (fnAns === false) return false; // not droppable

    if (fnAns === undefined) {
      // use default strategy
      return this.hoveringBlock?.index ?? reduce(slot.items, 0, (c, i) => Math.max(c, i.index + 1));
    }

    return fnAns;
  }
}
