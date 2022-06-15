import * as React from "preact";
import { useContext, useReducer } from "preact/hooks";
import { moveItemsInArray, moveItemsBetweenArrays, removeItems } from "@lyonbot/interactive-blocks";

export interface MyDataItem {
  name: string;
  children?: MyDataItem[];
}

const getDefaultValue = (): MyDataItem[] => [
  { name: "🧩 Click to Pick", children: [{ name: "🍬 Alice" }, { name: "🧸 Bob" }] },
  { name: "Drag Card into slot 👇" },
  { name: "shortcut keys works too" },
];

interface StoreAction {
  path: number[];  // which block? empty array = root
  rename?: { name: string };
  remove?: { indexes: number[] };
  insert?: { index: number; items: MyDataItem[] };
  moveInSlot?: { fromIndexes: number[]; toIndex: number };
  moveBetweenSlots?: { fromPath: number[]; fromIndexes: number[]; toIndex: number };

  __demo_wholeReplace__?: MyDataItem[];
}

const lazyClone = (state: MyDataItem[]) => {
  const root = [...state];
  const copiedBlocks = {} as Record<string, MyDataItem>;

  return {
    root,
    copiedBlocks,
    getSlotAndBlock(path: number[]) {
      let slot = root; // from root
      let block = null as null | MyDataItem;
      let key = "";

      path.forEach(x => {
        key += `/${x}`;

        if (!(key in copiedBlocks)) {
          // not visited this block before
          // clone the block and its children
          const oldBlock = slot[x]!;
          const newBlock = { ...oldBlock, children: [...oldBlock.children || []] };
          slot[x] = newBlock;
          copiedBlocks[key] = newBlock;
        }

        block = copiedBlocks[key]!;
        slot = block.children!;
      });

      return { slot, block };
    },
  };
};

const reducer = (state: MyDataItem[], action: StoreAction): MyDataItem[] => {
  if ("__demo_wholeReplace__" in action) return action.__demo_wholeReplace__!;

  const lazyCloneCtx = lazyClone(state);
  const { slot, block } = lazyCloneCtx.getSlotAndBlock(action.path);

  // ------------------------
  // now we just mutate `slot` -- it is a clone now

  if (action.rename) {
    if (block) block.name = action.rename.name;
  }

  if (action.insert) {
    slot.splice(action.insert.index, 0, ...action.insert.items);
  }

  if (action.remove) {
    removeItems(slot, action.remove.indexes);
  }

  if (action.moveInSlot) {
    const { fromIndexes, toIndex } = action.moveInSlot;
    moveItemsInArray(slot, fromIndexes, toIndex);
  }

  if (action.moveBetweenSlots) {
    const { fromPath, fromIndexes, toIndex } = action.moveBetweenSlots;
    const fromArr = lazyCloneCtx.getSlotAndBlock(fromPath).slot;
    moveItemsBetweenArrays(fromArr, fromIndexes, slot, toIndex);
  }

  console.log("store reducer called", action, lazyCloneCtx);

  return lazyCloneCtx.root;
};

const Ctx = React.createContext<[MyDataItem[], (action: StoreAction) => void]>(null as any);

export const StoreProvider = (props: { children?: React.ComponentChildren }) => {
  const stateAndDispatcher = useReducer(reducer, null, getDefaultValue);

  return <Ctx.Provider value={stateAndDispatcher}>{props.children}</Ctx.Provider>;
};

export const useStore = () => useContext(Ctx);
