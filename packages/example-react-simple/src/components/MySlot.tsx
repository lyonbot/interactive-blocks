import * as React from "react";
import { IBSlotWrapper, IBSlotWrapperProps } from "@lyonbot/interactive-blocks-react";
import { store, DataItem } from "../store";
import { MyBlock } from "./MyBlock";
import { PathArray } from "../utils/createStore";
import { removeItems } from "@lyonbot/interactive-blocks";

/**
 * Custom slot component.
 *
 * - `ownerPath` - example: `[2, "children", 1]` or `[]`
 */
export function MySlot(props: { ownerPath: PathArray }) {
  const [statusClassNames, setStatusClassNames] = React.useState("");

  const [ownerData, updateOwnerData] = store.use<DataItem>(props.ownerPath);
  const items = ownerData.children;

  // ❗ customize the "wrapperProps"
  const wrapperProps: IBSlotWrapperProps = ({
    onStatusChange(slot) {
      let ans = "";
      if (slot.isSelected) ans += " isSelected";
      if (slot.hasFocus) ans += " hasFocus";

      setStatusClassNames(ans);
    },

    handleInsert(action) {
      updateOwnerData(data => {
        if (!Array.isArray(data.children)) data.children = [];

        data.children.splice(action.index, 0, ...action.itemsData);
      });
    },

    handleMove(action) {
      updateOwnerData(data => {
        if (!Array.isArray(data.children)) data.children = [];

        const itemsData = removeItems(data.children, action.indexes);
        data.children.splice(action.toIndex, 0, ...itemsData);
      });
    },

    handleRemove(action) {
      updateOwnerData(data => {
        if (!Array.isArray(data.children)) data.children = [];

        removeItems(data.children, action.indexes);
      });
    },

    handleTransferInto(action) {
      // TODO: implement
    },
  });
  // ............

  const addItem = React.useCallback(() => {
    updateOwnerData(data => {
      if (!Array.isArray(data.children)) data.children = [];
      data.children.push({ name: "new item" });
    });
  }, []);

  return <IBSlotWrapper
    className={`mySlot ${statusClassNames}`}
    {...wrapperProps}
  >
    {items?.map((item, index) => <MyBlock key={index} path={[...props.ownerPath, "children", index]} />)}

    <button className="mySlot-addButton" onClick={addItem}>+</button>
  </IBSlotWrapper>;
}
