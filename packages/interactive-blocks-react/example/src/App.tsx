import * as React from "react";
import { ReactInteractiveBlocksRoot, useLatestRef, useNewBlockHandler, useNewSlotHandler } from "@lyonbot/interactive-blocks-react";
import { createStore } from "./simpleStore";
import { removeItems } from "@lyonbot/interactive-blocks";
import "./style.scss";

// ************************************************************************************************
// Store

interface DataItem {
  name: string;
  children?: DataItem[];
}

const store = createStore<DataItem>({
  name: "test",
  children: [
    { name: "child1" },
    { name: "child2" },
  ],
});

// ************************************************************************************************
// Main App

export function App() {
  return (
    <div>
      <h1>Hello World</h1>

      <ReactInteractiveBlocksRoot>
        <MyBlock path={[]} />
      </ReactInteractiveBlocksRoot>
    </div>
  );
}

export function MyBlock(props: { path: (string | number)[] }) {
  const [statusClassNames, setStatusClassNames] = React.useState("");
  const value = store.use(props.path) as DataItem;

  const lastProps = useLatestRef(props);
  const { handleBlockPointerUp, BlockWrapper } = useNewBlockHandler(() => ({
    index: () => +lastProps.current!.path.slice(-1)[0]!,
    data: () => store.get(lastProps.current!.path),
    onStatusChange: (block) => {
      let ans = "";
      if (block.isActive) ans += " isActive";
      if (block.hasFocus) ans += " hasFocus";

      setStatusClassNames(ans);
    },
  }));

  // ******************************

  const handleNameChange = React.useCallback((ev: any) => {
    store.set([...props.path, "name"], ev.target.value);
  }, []);

  return <BlockWrapper>
    <div tabIndex={-1} onPointerUp={handleBlockPointerUp} className={`myBlock ${statusClassNames}`}>
      <input type="text" value={value.name} onChange={handleNameChange} className="myBlock-name" />
      <MySlot path={[...props.path, "children"]} />
    </div>
  </BlockWrapper>;
}

export function MySlot(props: { path: (string | number)[] }) {
  const [statusClassNames, setStatusClassNames] = React.useState("");
  const value = store.use(props.path) as DataItem[] | undefined;

  // ******************************

  const lastProps = useLatestRef(props);
  const { handleSlotPointerUp, SlotWrapper } = useNewSlotHandler(() => ({
    onStatusChange: (slot) => {
      let ans = "";
      if (slot.isActive) ans += " isActive";
      if (slot.hasFocus) ans += " hasFocus";

      setStatusClassNames(ans);
    },

    // for slot

    onCut: (action) => {
      const path = lastProps.current!.path;
      const newList: DataItem[] = (store.get(path) || []).slice();

      removeItems(newList, action.indexes);
      store.set(path, newList);
    },

    onPaste: (action) => {
      const path = lastProps.current!.path;
      const newList: DataItem[] = (store.get(path) || []).slice();

      newList.splice(action.index, 0, ...action.data.blocksData);
      store.set(path, newList);
    },
  }));

  // ******************************

  const addItem = React.useCallback(() => {
    const path = lastProps.current!.path;
    const newList: DataItem[] = (store.get(path) || []).slice();

    newList.push({ name: "new item" });
    store.set(path, newList);
  }, []);


  return <SlotWrapper>
    <div tabIndex={-1} onPointerUp={handleSlotPointerUp} className={`mySlot ${statusClassNames}`}>
      {value?.map((item, index) => <MyBlock key={index} path={[...props.path, index]} />)}

      <button className="mySlot-addButton" onClick={addItem}>+</button>
    </div>
  </SlotWrapper>;
}
