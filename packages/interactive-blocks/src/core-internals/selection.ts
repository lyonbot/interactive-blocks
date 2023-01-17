import { IBBlock, IBSlot } from "../IBElement";
import { IBContext } from "../IBContext";
import { MultipleSelectType, normalizeMultipleSelectType } from "../utils/multiple-select";
import { head } from "../utils/iter";
import { liftBlock, toBlockArray } from "./relation";
import { MaybeArray, toArray } from "../utils/array";
import { isContextMultipleSelect } from "./defaults";

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

/**
 * internal method: compute new selection and update `ctx`
 *
 * Note: this function will not emit events -- see {@link emitSelectionChangeEvents}
 */
export function updateSelection(
  ctx: IBContext,
  deltaBlocks: MaybeArray<IBBlock>,
  multipleSelect?: MultipleSelectType,
  preferredSlot?: IBSlot | null,
  clearPrevSelection?: boolean
) {
  const multiSel = isContextMultipleSelect(ctx) ? normalizeMultipleSelectType(multipleSelect) : "none";
  const getChanges = startDiffSelection(ctx);
  let blocks = toArray(deltaBlocks);

  let newSelectedSlot = typeof preferredSlot === "undefined" ? ctx.selectedSlot : preferredSlot;
  let newSelectedBlocks = (multiSel === "none" || clearPrevSelection) ? [] : Array.from(ctx.selectedBlocks);

  if (multiSel === "none") blocks = blocks.slice(0, 1);  // "none" mode -- only select up to 1 block
  newSelectedBlocks.push(...blocks);

  const normalized = normalizeSelection(newSelectedBlocks, newSelectedSlot);
  newSelectedBlocks = normalized.blocks;
  newSelectedSlot = normalized.slot;

  // ----------------------------------------------------------------
  // if is "shift" mode
  // find the nearest selected block and make a continuous selection

  if (multiSel === "shift" && newSelectedSlot) {
    // this array is sorted by index
    const slotChildren = toBlockArray(newSelectedSlot.children);
    const newlySelected = new Set(Array.from(blocks, block => liftBlock(block, newSelectedSlot)));

    // fix `slotChildren` because the `newSelectedBlocks` is not committed yet
    slotChildren.forEach(it => {
      it.isSelected = newSelectedBlocks.includes(it.block);
    });

    // iterate through all blocks, including not-selected blocks
    const count = slotChildren.length;
    for (let i = 0; i < count; i++) {
      const it = slotChildren[i]!;
      if (!it.isSelected || !newlySelected.has(it.block)) continue;

      // if curr is newly selected, mark all adjacent blocks as selected

      let direction: "L" | "R" | "" = "";
      let span = 0;
      while (!direction && (i + span < count || i - span >= 0)) {
        span++;

        const leftPtr = slotChildren[i - span];
        const rightPtr = slotChildren[i + span];

        if (leftPtr?.isSelected) direction = "L";
        if (rightPtr?.isSelected) direction = "R";
      }
      if (!direction) continue;

      // now do the selection

      const from = (direction == "L") ? i - span : i + 1;
      const to = (direction === "L") ? i - 1 : i + span;
      for (let j = from; j <= to; j++) {
        const it = slotChildren[j]!;
        if (!it.isSelected) {
          it.isSelected = true;
          newSelectedBlocks.push(it.block);
        }
      }
    }
  }

  // ----------------------------------------------------------------
  // commit changes

  ctx.selectedBlocks = new Set(newSelectedBlocks);
  ctx.selectedSlot = newSelectedSlot;

  return getChanges();
}

/**
 * for single selection: ensure slot is adjacent to block
 *
 * for multiple selection: ignore given `slot`,
 * then ensure that selection follows rules of <docs/under-the-hood/selection.md>
 */
function normalizeSelection(
  blocks: IBBlock[],
  slot: IBSlot | null
): { blocks: IBBlock[]; slot: IBSlot | null } {
  const firstBlock = blocks[0];

  if (!firstBlock) {
    // no block is chosen, try slot's parent
    const preferredBlock = slot?.parent;
    return { blocks: preferredBlock ? [preferredBlock] : [], slot };
  }

  if (blocks.length === 1) {
    // only one block is chosen
    // ensure the slot's depth is adjacent to the block's -- aka. the slot is parent or block's child
    const blockDepth = firstBlock.depth;

    if (slot && slot.depth < blockDepth) {
      slot = firstBlock.parent;
    } else {
      while (slot && slot.depth > blockDepth + 1) slot = slot.parent?.parent || null;
      if (!slot || slot.parent !== firstBlock) {
        slot = head(firstBlock.children) || firstBlock.parent;
      }
    }

    return { blocks: [firstBlock], slot };
  }

  // ----------------------------------------------------------------
  // multiple blocks are selected,
  //
  // find the common ancestor slot, then
  // hoist selected blocks to the nearest ancestors that satisfy
  //
  // -- see rules of <docs/under-the-hood/selection.md>

  let outmostSlot: IBSlot | null | undefined = firstBlock.parent;
  for (let i = 1; outmostSlot && i < blocks.length; i++) {
    let slot: IBSlot | null | undefined = blocks[i]!.parent;

    while (outmostSlot && slot && outmostSlot !== slot) {
      const delta = slot.depth - outmostSlot.depth;
      const forceHoist = delta === 0 && slot !== outmostSlot;

      if (delta > 0 || forceHoist) slot = slot.parent?.parent;
      if (delta < 0 || forceHoist) outmostSlot = outmostSlot.parent?.parent;
    }

    if (!slot || !outmostSlot) outmostSlot = null;
  }

  const uniqBlocks = new Set(
    Array
      .from(blocks, b => liftBlock(b, outmostSlot!))
      .filter(Boolean)
  );

  return {
    blocks: Array.from(uniqBlocks) as Array<IBBlock>,
    slot: outmostSlot,
  };
}

export function emitSelectionChangeEvents(ctx: IBContext, changes: null | {
  slots?: Iterable<IBSlot | null | undefined>;
  blocks?: Iterable<IBBlock | null | undefined>;
}) {
  if (!changes) return null;

  const blocks = new Set<IBBlock>();
  const slots = new Set<IBSlot>();

  if (changes.blocks) {
    for (const block of changes.blocks) {
      if (!block) continue;

      blocks.add(block);
      block.emit("statusChange", block);
    }
  }

  if (changes.slots) {
    for (const slot of changes.slots) {
      if (!slot) continue;

      slots.add(slot);
      slot.emit("statusChange", slot);
    }
  }

  if (blocks.size || slots.size) {
    ctx.emit("selectionChange", ctx, { blocks, slots });
    return { blocks, slots };
  }

  return null;
}
