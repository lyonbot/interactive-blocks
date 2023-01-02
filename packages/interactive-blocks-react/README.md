# @lyonbot/interactive-blocks-react

This package helps you integrate [interactive-blocks](https://lyonbot.github.io/interactive-blocks/) to your ⚛️ React app, with 🪝 React Hooks API.

- [Example Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/example-react-simple) | [Try with StackBlitz](https://stackblitz.com/github/lyonbot/interactive-blocks/tree/main/packages/example-react-simple) | [Source Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/interactive-blocks-react)

## Usage

All you need is

- write a **Block component**
- write a **Slot Component**, which lists your Blocks inside
  - a Block can also contain sub-Slots inside
- finally, render Blocks and Slots in a `<ReactInteractiveBlocksRoot>`

You can integrate with your state management (Redux, Mobx, Recoil, immer, etc.):

- In Block Component: `index` and `data` getter functions
- In Slot Component: `onCut` and `onPaste` callbacks
- More details can be found below.

### Basic Scaffolding

Details can be found after this scaffolding code.

```jsx
import { ReactInteractiveBlocksRoot, useLatestRef, useBlockHandler, useSlotHandler } from "@lyonbot/interactive-blocks-react";

// in <App>

<ReactInteractiveBlocksRoot>
  {/* put root blocks and root slots here */}
</ReactInteractiveBlocksRoot>

// -------------------------------------------------
// then write MyBlock component

function MyBlock(props) {
  const [statusClassNames, setStatusClassNames] = React.useState("");
  const { divProps, BlockWrapper } = useBlockHandler(() => ({
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
  // ❗ 2. Must have {...divProps}

  return <BlockWrapper>
    <div
      {...divProps}
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
  // ❗ 2. Must have {...divProps}

  return <SlotWrapper>
    <div
      {...divProps}
      className={`mySlot ${statusClassNames}`}
    >

      {/* render sub-block list here */}
      <MyBlock .... />

    </div>
  </SlotWrapper>;
}
```

## Integrate with your state management

As mentioned above, you have to write...

- In Block Component: `index` and `data` getter functions
- In Slot Component: `onCut` and `onPaste` callbacks

### Don't directly use `props` and state

In `useBlockHandler` and `useSlotHandler`, the initializer function only executes once, therefore, **you can't directly use `props` and state inside it ❗**. The closure captures the first props and never update!

To solve this kludge problem, you can use `useLatestRef` to make a ref, and keep it synchronized with the latest props and state values.

For example, in Block component, we make a `propsRef` and access newest prop values via `propsRef.current.*`:

```jsx
import { useLatestRef } from "@lyonbot/interactive-blocks-react";

function MyBlock(props) {
  const propsRef = useLatestRef(props);  // 👈  new
  const { handleBlockPointerUp, BlockWrapper } = useBlockHandler(() => ({
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

#### onCut

When delete blocks (cut), you can use `indexesDescending` to **safely** remove items from the list.

```js
const newList = oldList.slice(); // copy old list

// delete items one-by-one
action.indexesDescending.forEach(index => {
  newList.splice(index, 1);
})

*** // ❗ now, submit the newList to the state
```

#### onPaste

When insert blocks (paste), you can read Block `data` getter function's output, and insert them into the list.

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
  divProps,
  BlockWrapper,
  blockHandler, // 👈  new
} = useBlockHandler(() => ({
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
  divProps,
  SlotWrapper,
  slotHandler, // 👈  new
} = useSlotHandler(() => ({
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
