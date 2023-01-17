import { IBInsertAction, IBRemoveAction } from "../base-action";
import { IBBlock, IBSlot } from "../IBElement";
import { findLast, toArray } from "../utils/array";
import { retryWithin, then } from "../utils/fn";
import { find } from "../utils/iter";
import { isContextMultipleSelect } from "./defaults";
import { toBlockArray } from "./relation";

export function removeBlocks(slot: IBSlot | null | undefined, indexes: number[]) {
  if (!slot) return;

  const ctx = slot.ctx;
  const action: IBRemoveAction = {
    is: "remove",
    ctx,
    slot,
    indexes,
    indexesDescending: indexes.slice().sort((a, b) => b - a),
  };

  return then(
    slot.options.handleRemove(action),
    () => { /* TODO: emit events */ }
  );
}

export function insertBlocks(slot: IBSlot | null | undefined, itemsData: any[] | any) {
  if (!slot) return;
  if (!(itemsData = toArray(itemsData)).length) return;

  const ctx = slot.ctx;

  const blocks = toBlockArray(slot.children);
  const lastSelected = findLast(blocks, b => b.isSelected);

  const index = (lastSelected?.index ?? blocks[blocks.length - 1]?.index ?? -1) + 1;
  const action: IBInsertAction = {
    is: "insert",
    ctx,
    slot,
    index,
    itemsData,
  };

  // we can't correctly sense the data's change and block rendering
  // so set a timer to select inserted blocks
  // (assume all blocks renders at the same time)

  const oldItem = blocks.find(x => x.index === index)?.block;

  return then(
    slot.options.handleInsert(action),
    () => {
      /* TODO: emit events */

      retryWithin(500, () => {
        const newItem = find(slot.children, it => it.index === index);
        if (!newItem || newItem === oldItem) return; // not found yet

        const blocks = [newItem];
        if (action.itemsData.length > 1 && isContextMultipleSelect(ctx)) {
          // multiple select
          blocks.length = action.itemsData.length;
          toBlockArray(slot.children).forEach(it => {
            if (it.index > index && it.index < index + action.itemsData.length) blocks[it.index - index] = it.block;
          });
        }

        ctx.selectBlock(blocks, "ctrl", slot, true);
        return true;
      });
    }
  );
}
