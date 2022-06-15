# @lyonbot/interactive-blocks-react

[ Demo ](@lyonbot/interactive-blocks-react)

## Usage

```js
import { ReactInteractiveBlocksRoot, useLatestRef, useNewBlockHandler, useNewSlotHandler } from "@lyonbot/interactive-blocks-react";
import { removeItems } from "@lyonbot/interactive-blocks";   // very useful util function

// in <App>

<ReactInteractiveBlocksRoot>
  {/* put root blocks and root slots here */}
</ReactInteractiveBlocksRoot>

// -------------------------------------------------
// then write MyBlock component

function MyBlock(props) {
  const [statusClassNames, setStatusClassNames] = React.useState("");
  const { handleBlockPointerUp, BlockWrapper } = useNewBlockHandler(() => ({
    index: () => ***,  // ❗ a getter function, returning index
    data: () => ***, // ❗ a getter function, returning item value (object)
    onStatusChange: (block) => {
      let ans = "";
      if (block.isActive) ans += " isActive";
      if (block.hasFocus) ans += " hasFocus";

      setStatusClassNames(ans);
    },
  }));

  // ............
  // ❗ 1. Must be wrapped by <BlockWrapper>
  // ❗ 2. Must have tabIndex={-1}
  // ❗ 3.           onPointerUp={handleBlockPointerUp}

  return <BlockWrapper>
    <div
      tabIndex={-1}
      onPointerUp={handleBlockPointerUp}
      className={`myBlock ${statusClassNames}`}
    >

      {/* render sub-slots here */}
      <MySlot .... />

    </div>
  </BlockWrapper>;
}

// -------------------------------------------------
// then write MySlot component

export function MySlot(props) {
  const [statusClassNames, setStatusClassNames] = React.useState("");
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

  // ............
  // ❗ 1. Must be wrapped by <SlotWrapper>
  // ❗ 2. Must have tabIndex={-1}
  // ❗ 3.           onPointerUp={handleSlotPointerUp}

  return <SlotWrapper>
    <div
      tabIndex={-1}
      onPointerUp={handleSlotPointerUp}
      className={`mySlot ${statusClassNames}`}
    >

      {/* render sub-blocks here */}
      <MyBlock .... />

    </div>
  </SlotWrapper>;
}
```
