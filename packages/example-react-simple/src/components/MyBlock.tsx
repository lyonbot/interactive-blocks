import * as React from "react";
import { IBBlockWrapper, IBBlockWrapperProps } from "@lyonbot/interactive-blocks-react";
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
  const [itemData, updateItemData] = store.use<DataItem>(props.path);

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((ev) => { updateItemData(item => { item.name = ev.target.value; }); }, []);


  const path = props.path;

  // ❗ customize the "wrapperProps"
  const wrapperProps: IBBlockWrapperProps = {
    index: (path.length === 0)
      ? 0 // root block's path is empty
      : path[path.length - 1] as number, // other block, the last element of `path` is the index

    data: itemData,

    onStatusChange(block) {
      let ans = "";
      if (block.isSelected) ans += " isSelected";
      if (block.hasFocus) ans += " hasFocus";

      setStatusClassNames(ans);
    },
  };
  // ............

  return <IBBlockWrapper
    className={`myBlock ${statusClassNames}`}
    {...wrapperProps}
  >
    <input type="text" value={itemData.name} onChange={handleNameChange} className="myBlock-name" />
    <MySlot ownerPath={props.path} />
  </IBBlockWrapper>;
}
