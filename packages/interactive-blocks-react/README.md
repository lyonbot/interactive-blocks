# @lyonbot/interactive-blocks-react

This package helps you integrate [interactive-blocks](https://lyonbot.github.io/interactive-blocks/) to your ⚛️ React app, with 🪝 React Hooks API.

- [Example Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/interactive-blocks-react/example) | [Try with StackBlitz](https://stackblitz.com/github/lyonbot/interactive-blocks/tree/main/packages/interactive-blocks-react/example)

## Usage

All you need is writing a **Block component** and a **Slot Component**, and use them inside `<ReactInteractiveBlocksRoot>`

To integrate with your state management (Redux, Mobx, Recoil, immer, etc.), you have to accomplish the following:

- In Block Component: `index` and `data` getter functions
- In Slot Component: `onCut` and `onPaste` callbacks

More guides can be found after the scaffolding.

### Basic Scaffolding

```jsx
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
    data: () => ***,   // ❗ a getter function, returning current block's data (for onPaste)
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
      /**
       * ❗ delete items at `action.indexes`
       */
    },

    onPaste: (action) => {
      /**
       * ❗ read `action.data.blocksData` ( from Block component's `data` getter )
       * ❗ and insert into the list, at `action.index`
       */
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

## Integrate with your state management

As mentioned above, you have to accomplish the following:

- In Block Component: `index` and `data` getter functions
- In Slot Component: `onCut` and `onPaste` callbacks

### Don't directly use `props` and state

In `useNew***Handler`, the initializer function only executes once, therefore, **you can't directly use `props` and state inside it ❗**. The closure captures the first props and never update!

To solve this kludge problem, you can use `useLatestRef` to make a ref, and keep it synchronized with the latest props and state values.

For example, in Block component, we make a `propsRef` and access newest prop values via `propsRef.current.*`:

```jsx
import { useLatestRef } from "@lyonbot/interactive-blocks-react";

function MyBlock(props) {
  const propsRef = useLatestRef(props);  // 👈  new
  const { handleBlockPointerUp, BlockWrapper } = useNewBlockHandler(() => ({
    index: () => propsRef.current.index,  // 👈  always get latest "index" prop
    data: () => propsRef.current.value,   // 👈  always get latest "value" prop
    ...
```

It's also necessary in Slot component!

### Update state in Slot callbacks

You must have noticed `onCut` and `onPaste` callbacks.

```js
  onCut: (action) => {
    /**
     * ❗ delete items at `action.indexes`
     */
  },

  onPaste: (action) => {
    /**
     * ❗ read `action.data.blocksData` ( from Block component's `data` getter )
     * ❗ and insert into the list, at `action.index`
     */
  },
```

- If you are using global state management, you can use `dispatch` to update data here.
- If you want to invoke callbacks from props, you can do it like `propsRef.current.onChange(...)`

When cut (wiping out blocks), you can use `removeItems` to remove items from the list.

```js
const newList = oldList.slice(); // copy old list
removeItems(newList, action.indexes); // delete items
*** // ❗ now, submit the newList to the state
```

When paste (inserting blocks), you can read Block `data` getter function's output, and insert them into the list.

```js
const newList = oldList.slice(); // copy old list
const items = action.data.blocksData; // read Block `data` getter function's output
*** // ❗ process the items, if needed
newList.splice(action.index, 0, ...items); // insert items
*** // ❗ now, submit the newList to the state
```

## Advanced: Customize Behaviors

### Root Context

```jsx
const handleInteractiveBlocksMount = useCallback((blockContext) => {
  // this callback only invoke once
  // you can add event listeners now.

  blockContext.on("focus", () => {
    console.log("focus");
  });

  blockContext.on("blur", () => {
    console.log("blur");
  });

  blockContext.on("paste", (action) => {
    console.log("pasting...", action);
  });

}, [])

<ReactInteractiveBlocksRoot
  options={/* see interactive-blocks document */}
  onMount={handleInteractiveBlocksMount}
  onUnmount={handleInteractiveBlocksUnmount}
>
  {/* put root blocks and root slots here */}
</ReactInteractiveBlocksRoot>
```

### Block Handler

In your Block component, you can get `blockHandler` and use it like this:

```jsx
const {
  handleBlockPointerUp,
  BlockWrapper,
  blockHandler, // 👈  new
} = useNewBlockHandler(() => ({
  /* options */
}));

// then you can call blockHandler methods like:
blockHandler.isActive
blockHandler.hasFocus

blockHandler.select();
blockHandler.focus();
blockHandler.unselect();

// and more
```

### Slot Handler

In your Slot component, you can get `slotHandler`:

```jsx
const {
  handleSlotPointerUp,
  SlotWrapper,
  slotHandler, // 👈  new
} = useNewSlotHandler(() => ({
  /* options */
}));

// then you can call slotHandler methods like:
slotHandler.isActive
slotHandler.hasFocus

slotHandler.isDescendantOfBlock(anotherBlockHandler);
slotHandler.isDescendantOfSlot(anotherSlotHandler);

slotHandler.select();
slotHandler.focus();

// and more
```
