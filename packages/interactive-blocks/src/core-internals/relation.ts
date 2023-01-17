import { IBBlock, IBSlot } from "../IBElement";

/**
 * sorted by index ascending
 */
export function toBlockArray(blocks: Iterable<IBBlock>) {
  return Array
    .from(blocks, (block) => ({ block, index: block.index, isSelected: block.isSelected }))
    .sort((a, b) => a.index - b.index);
}

/**
 * if `block` is not directly under the `ownerSlot`, find an ancestor block that satisfies
 */
export function liftBlock(block: IBBlock | null | undefined, ownerSlot: IBSlot | null): IBBlock | null {
  while (block) {
    if (block.parent === ownerSlot) return block;
    block = block.parent?.parent;
  }

  return null;
}
