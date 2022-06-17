import * as React from "react";
import { useLatestRef, useNewSlotHandler } from "@lyonbot/interactive-blocks-react";
import { store, DataItem } from "../store";
import { MyBlock } from "./MyBlock";
import { PathArray } from "../utils/createStore";

/**
 * Custom slot component.
 *
 * - `path` - example: `[2, "children"]`
 */
export function MySlot(props: { path: PathArray }) {
  const [statusClassNames, setStatusClassNames] = React.useState("");
  const value = store.use(props.path) as DataItem[] | undefined;

  /**
   * ❗ solve the React Hook closure kludge with useLatestRef
   */
  const propsRef = useLatestRef(props);
  const { handleSlotPointerUp, SlotWrapper } = useNewSlotHandler(() => ({
    onStatusChange: (slot) => {
      let ans = "";
      if (slot.isActive) ans += " isActive";
      if (slot.hasFocus) ans += " hasFocus";

      setStatusClassNames(ans);
    },

    // for slot
    onCut: (action) => {
      /**
       * ❗ delete items at `action.indexes`
       */

      const path = propsRef.current!.path;
      const newList: DataItem[] = (store.get(path) || []).slice();

      // in newList, delete them one-by-one
      action.indexesDescending.forEach(index => { newList.splice(index, 1); });

      store.set(path, newList);
    },

    onPaste: (action) => {
      /**
       * ❗ read `action.data.blocksData` ( from Block component's `data` getter )
       * ❗ and insert into the list, at `action.index`
       */

      const path = propsRef.current!.path;
      const newList: DataItem[] = (store.get(path) || []).slice();

      newList.splice(action.index, 0, ...action.data.blocksData);
      store.set(path, newList);
    },
  }));


  // ******************************
  const addItem = React.useCallback(() => {
    const path = propsRef.current!.path;
    const newList: DataItem[] = (store.get(path) || []).slice();

    newList.push({ name: "new item" });
    store.set(path, newList);
  }, []);


  // ............
  // ❗ 1. Must be wrapped by <SlotWrapper>
  // ❗ 2. Must have tabIndex={-1}
  // ❗ 3.           onPointerUp={handleSlotPointerUp}

  return <SlotWrapper>
    <div tabIndex={-1} onPointerUp={handleSlotPointerUp} className={`mySlot ${statusClassNames}`}>
      {value?.map((item, index) => <MyBlock key={index} path={[...props.path, index]} />)}

      <button className="mySlot-addButton" onClick={addItem}>+</button>
    </div>
  </SlotWrapper>;
}
