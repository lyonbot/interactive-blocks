import * as React from "react";
import { useLatestRef, useSlotHandler } from "@lyonbot/interactive-blocks-react";
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
   * ❗ `useSlotHandler` only run once,
   *    therefore, to read latest props value inside it, we need a consistent Ref `propsRef`
   *    and use `propsRef.current` to get the newest prop values
   */
  const propsRef = useLatestRef(props);
  const { divProps, SlotWrapper } = useSlotHandler(() => ({
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
  // ❗ 2. Must have {...divProps}

  return <SlotWrapper>
    <div {...divProps} className={`mySlot ${statusClassNames}`}>
      {value?.map((item, index) => <MyBlock key={index} path={[...props.path, index]} />)}

      <button className="mySlot-addButton" onClick={addItem}>+</button>
    </div>
  </SlotWrapper>;
}
