import * as React from "react";
import { useBlockHandler } from "@lyonbot/interactive-blocks-react";
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
  const [value, updateValue] = store.use<DataItem>(props.path)

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((ev) => { updateValue(item => { item.name = ev.target.value }); }, []);

  const { domProps, BlockWrapper } = useBlockHandler({
    // ❗ a getter function, returning index
    index: () => {
      const path = props.path; // example: `[2, "children", 1]`

      if (!path.length) return 0;  // root block's path is empty
      return path[path.length - 1] as number; // other block, the last element of `path` is the index
    },

    // ❗ a getter function, returning current block's data (for copy&paste)
    data: () => {
      const path = props.path; // example: `[2, "children", 1]`
      return store.get(path);
    },

    // callback to update style
    onStatusChange: (block) => {
      let ans = "";
      if (block.isSelected) ans += " isSelected";
      if (block.hasFocus) ans += " hasFocus";

      setStatusClassNames(ans);
    },
  });

  // ******************************


  // ............
  // ❗ 1. Must be wrapped by <BlockWrapper>
  // ❗ 2. Must have {...domProps}

  return <BlockWrapper>
    <div {...domProps} className={`myBlock ${statusClassNames}`}>
      <input type="text" value={value.name} onChange={handleNameChange} className="myBlock-name" />
      <MySlot ownerPath={props.path} />
    </div>
  </BlockWrapper>;
}
