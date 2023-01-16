import { IBBlock, IBSlot } from "../IBElement";
import { IBContext } from "../IBContext";
import { MultipleSelectType, normalizeMultipleSelectType } from "../utils/multiple-select";
import { head, MaybeArray, toArray } from "../utils/iter";
import { findCommonSlot, liftBlock } from "./relation";

export function startDiffSelection(ctx: IBContext) {
  const lastSlot = ctx.selectedSlot;
  const lastBlocks = new Set(ctx.selectedBlocks);

  const getChanges = () => {
    const slots = new Set<IBSlot>();
    if (ctx.selectedSlot !== lastSlot) {
      if (lastSlot) slots.add(lastSlot);
      if (ctx.selectedSlot) slots.add(ctx.selectedSlot);
    }

    const blocks = new Set(lastBlocks);
    ctx.selectedBlocks.forEach(block => {
      if (blocks.has(block)) blocks.delete(block);
      else blocks.add(block);
    });

    if (!(slots.size || blocks.size)) return null;

    return {
      slots,
      blocks,
    };
  };

  return getChanges;
}

export function updateSelection(
  ctx: IBContext,
  deltaBlocks: MaybeArray<IBBlock>,
  multipleSelect?: MultipleSelectType,
  preferredSlot?: IBSlot | null,
  clearPrevSelection?: boolean
) {
  const multiSel = (ctx.options.multipleSelect ?? true) ? normalizeMultipleSelectType(multipleSelect) : "none";
  const getChanges = startDiffSelection(ctx);
  const blocks = toArray(deltaBlocks);

  let newSelectedSlot = typeof preferredSlot === "undefined" ? ctx.selectedSlot : preferredSlot;
  const newSelectedBlocks = ctx.selectedBlocks;

  if (multiSel === "none") {
    newSelectedBlocks.clear();
    if (blocks.length) newSelectedBlocks.add(blocks[0]!);
  } else {
    if (clearPrevSelection) {
      newSelectedBlocks.clear();
      if (newSelectedSlot !== preferredSlot) newSelectedSlot = blocks[0]?.parent || null;
    }

    for (let block of blocks) {
      // find the common ancestor slot, then
      // if selected blocks and to-be-selected block are not under exact the same slot
      // hoist selection to the ancestor blocks that satisfy
      const commonSlot = newSelectedSlot ? findCommonSlot(newSelectedSlot, block.parent) : block.parent;
      if (commonSlot !== newSelectedSlot) {
        newSelectedSlot = commonSlot;

        const lastBlocks = Array.from(newSelectedBlocks);
        newSelectedBlocks.clear();
        for (const block of lastBlocks) {
          const b = liftBlock(block, newSelectedSlot);
          if (b) newSelectedBlocks.add(b);
        }

        const lifted = liftBlock(block, newSelectedSlot);
        if (!lifted) continue;

        block = lifted;
      }

      // TODO: make "shift" works here

      newSelectedBlocks.add(block);
    }
  }

  ctx.selectedSlot = normalizeSelectedSlot(newSelectedSlot, head(newSelectedBlocks));
  ctx.selectedBlocks = newSelectedBlocks;

  return getChanges();
}

/**
 * select correct slot that satisfies `abs(slot.depth - block.depth) <= 1`
 */
function normalizeSelectedSlot(slot: IBSlot | null, block: IBBlock | null | undefined): IBSlot | null {
  if (!slot) return null;
  if (!block) return slot.depth === 0 ? slot : null;
  if (slot.parent === block || block.parent === slot) return slot;
  if (slot.depth > block.depth) return head(block.children) || null;
  return block.parent;
}

export function emitSelectionChangeEvents(ctx: IBContext, changes: null | {
  slots: Set<IBSlot>;
  blocks: Set<IBBlock>;
}) {
  if (!changes) return false;

  changes.blocks.forEach(block => block.emit("statusChange", block));
  changes.slots.forEach(slot => slot.emit("statusChange", slot));
  ctx.emit("selectionChange", ctx, changes);

  return true;
}
