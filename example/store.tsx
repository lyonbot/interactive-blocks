import * as React from "preact";
import { useContext, useReducer } from "preact/hooks";

export interface MyDataItem {
  name: string;
  children?: MyDataItem[];
}

const getDefaultValue = (): MyDataItem[] => [
  { name: "aaa" },
  { name: "bbb", children: [{ name: "b1" }, { name: "b2" }] },
  { name: "ccc" },
];

interface StoreAction {
  path: number[];  // which block? empty array = root
  rename?: { name: string };
  remove?: { indexes: number[] };
  insert?: { index: number; items: MyDataItem[] };

  __demo_wholeReplace__?: MyDataItem[];
}

const reducer = (state: MyDataItem[], action: StoreAction): MyDataItem[] => {
  if ("__demo_wholeReplace__" in action) return action.__demo_wholeReplace__!;

  const newState = [...state];

  let slot = newState; // from root
  let block = null as null | MyDataItem;
  action.path.forEach(x => {
    const oldItem = slot[x]!;
    const newItem = { ...oldItem, children: [...oldItem.children || []] };
    slot[x] = newItem;
    block = newItem;
    slot = newItem.children!;
  });

  // ------------------------
  // now we just mutate `slot` -- it is a clone now

  if (action.rename) if (block) block.name = action.rename.name;
  if (action.insert) slot.splice(action.insert.index, 0, ...action.insert.items);
  if (action.remove) [...action.remove.indexes].sort((a, b) => b - a).forEach(index => slot.splice(index, 1));

  console.log("store reducer called", action, newState);

  return newState;
};

const Ctx = React.createContext<[MyDataItem[], (action: StoreAction) => void]>(null as any);

export const StoreProvider = (props: { children?: React.ComponentChildren }) => {
  const stateAndDispatcher = useReducer(reducer, null, getDefaultValue);

  return <Ctx.Provider value={stateAndDispatcher}>{props.children}</Ctx.Provider>;
};

export const useStore = () => useContext(Ctx);
