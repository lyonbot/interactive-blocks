import * as React from "react";
import { useLatestRef, useBlockHandler } from "@lyonbot/interactive-blocks-react";
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
   * ❗ `useBlockHandler` only run once,
   *    therefore, to read latest props value inside it, we need a consistent Ref `propsRef`
   *    and use `propsRef.current` to get the newest prop values
   */
  const propsRef = useLatestRef(props);
  const { divProps, BlockWrapper } = useBlockHandler(() => ({

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
  // ❗ 2. Must have {...divProps}

  return <BlockWrapper>
    <div {...divProps} className={`myBlock ${statusClassNames}`}>
      <input type="text" value={value.name} onChange={handleNameChange} className="myBlock-name" />
      <MySlot path={[...props.path, "children"]} />
    </div>
  </BlockWrapper>;
}
