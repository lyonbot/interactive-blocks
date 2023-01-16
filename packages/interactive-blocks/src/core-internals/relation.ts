import { IBBlock, IBSlot } from "../IBElement";

export function findCommonSlot(
  slot1: IBSlot | null | undefined,
  slot2: IBSlot | null | undefined
): IBSlot | null {
  if (!slot2) return null;
  if (slot1 === slot2) return slot1; // optimize: fast short-circuit
  while (slot1 && slot1.depth > slot2.depth) slot1 = slot1.parent?.parent;

  if (!slot1) return null;
  while (slot2 && slot2.depth > slot1.depth) slot2 = slot2.parent?.parent;

  while (slot1 && slot2) {
    if (slot1 === slot2) return slot1;
    slot1 = slot1.parent?.parent;
    slot2 = slot2.parent?.parent;
  }

  return null;
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
