import * as React from "react";
import { useLatestRef, useNewBlockHandler } from "@lyonbot/interactive-blocks-react";
import { store, DataItem } from "../store";
import { MySlot } from "./MySlot";
import { PathArray } from "../utils/createStore";

/**
 * Custom Block component, aka the card
 *
 * - `path` - example: `[2, "children", 1]`
 */
export function MyBlock(props: { path: PathArray }) {
  const [statusClassNames, setStatusClassNames] = React.useState("");
  const value = store.use(props.path) as DataItem;

  /**
   * ❗ solve the React Hook closure kludge with useLatestRef
   */
  const propsRef = useLatestRef(props);
  const { handleBlockPointerUp, BlockWrapper } = useNewBlockHandler(() => ({

    // ❗ a getter function, returning index
    index: () => {
      const path = propsRef.current!.path; // example: `[2, "children", 1]`

      if (!path.length) return 0;  // root block's path is empty
      return path[path.length - 1] as number; // other block, the last element of `path` is the index
    },

    // ❗ a getter function, returning current block's data (for copy&paste)
    data: () => {
      const path = propsRef.current!.path;
      return store.get(path);
    },

    // callback to update style
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


  // ............
  // ❗ 1. Must be wrapped by <BlockWrapper>
  // ❗ 2. Must have tabIndex={-1}
  // ❗ 3.           onPointerUp={handleBlockPointerUp}

  return <BlockWrapper>
    <div tabIndex={-1} onPointerUp={handleBlockPointerUp} className={`myBlock ${statusClassNames}`}>
      <input type="text" value={value.name} onChange={handleNameChange} className="myBlock-name" />
      <MySlot path={[...props.path, "children"]} />
    </div>
  </BlockWrapper>;
}
