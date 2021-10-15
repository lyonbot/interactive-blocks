# Drag and Drop

Read [Basic Setup](./basic-setup.md) before this!

To support drag and drop, modify your Block Component and Slot Component:

## 🧩 Block Component

### creating

no extra work to do.

### handle DOM events

First of all, add `draggable` to the DOM element!

Then, while creating, generate the default event listeners:

```js
const theGeneratedListeners =
  blockContext.dragging.getDefaultBlockEventHandlers(blockHandler, "react");
```

The last parameter is the style of event names. It can be:

- `"react"` --> onDragStart
- `"lowercase"` --> dragstart
- `"camelCase"` --> dragStart

For example, in `"react"` style, it returns a object like this:

```js
// dragCtx = blockContext.dragging
// block = blockHandler

{
  onDragStart: (event) => dragCtx.handleBlockDragStart(block, event),
  onDragEnd: (event) => dragCtx.handleBlockDragEnd(block, event),
  onDragOver: (event) => dragCtx.handleBlockDragOver(block, event),
  onDragLeave: (event) => dragCtx.handleBlockDragLeave(block, event),
}
```

For React, you can simply add them like this:

```jsx {2-3}
<div
  className="myBlock"
  draggable
  {...theGeneratedListeners}
>
  ...
```

For Vue, you can also generate listeners with `"lowercase"` style (important!), and use them like this:

```xml {2}
<div
  class="myBlock"
  draggable
  v-on="theGeneratedListeners"
>
  ...
```

## 🧩 Slot Component

### creating

Write these callbacks:

- `onDragHoverStatusChange` -- update the visual feedback!
- `onMoveInSlot`
- `onMoveToThisSlot` -- if dragging happens between two slots

If drag source is NOT current BlockContext, `onPaste` will be called instead of the latter 2 callbacks.

Additionally, you can attach `this` of your component, to `slotHandler.ref`,
so you will be able to access the component instance somewhere else later.

```js
import { moveItemsInArray, moveItemsBetweenArrays } from "@lyonbot/interactive-blocks";

const slotHandler = parent.createSlot({
  onCut: ...,
  onPaste: ...,
  onActiveStatusChange: ...,

  // you can attach `this` of your component, to `slotHandler.ref`
  // so you will be able to access the component instance somewhere else later.
  //
  // if not needed, just remove this line:
  ref: this,

  // add these callbacks:

  onDragHoverStatusChange: ...,         // change visual feedback here

  onMoveInSlot: (action) => {
    // blocks are moving inside this slot
    // please mutate the array here

    // simplest example:
    //   use util function from "interactive-blocks"
    moveItemsInArray(
      /* array: */ this.getTheArray(),
      /* fromIndexes: */ action.blocks.map(x => x.index),
      /* toIndex: */ action.index,
    );

    // or you can call `dispatch` methods if you are using something like VueX or Redux
  },

  onMoveToThisSlot: (action) => {
    // blocks are moving inside this slot
    // please mutate the array here

    // simplest example:
    //   use util function from "interactive-blocks"
    moveItemsBetweenArrays(
      /* fromArray: */ action.fromSlot.ref.getTheArray(),  // if you always attach `this` to `slotHandler.ref`
      /* fromIndexes: */ action.blocks.map(x => x.index),
      /* toArray: */ this.getTheArray(),
      /* toIndex: */ action.index,
    );

    // or you can call `dispatch` methods if you are using something like VueX or Redux
  },
})
```

### handle DOM events

While creating, generate the default event listeners:

```js
const theGeneratedListeners = blockContext.dragging.getDefaultSlotEventHandlers(
  slotHandler,
  "react"
);
```

The last parameter is the style of event names. It can be:

- `"react"` --> onDragStart
- `"lowercase"` --> dragstart
- `"camelCase"` --> dragStart

For example, in `"react"` style, it returns a object like this:

```js
// dragCtx = blockContext.dragging
// slot = slotHandler

{
  onDragOver(ev) {
    if (!dragCtx.handleSlotDragOver(slot, ev)) return;

    ev.preventDefault();
    ev.stopPropagation();
  },

  onDragLeave(ev) {
    dragCtx.handleSlotDragLeave(slot);

    ev.preventDefault();
    ev.stopPropagation();
  },

  onDrop(ev) {
    dragCtx.handleSlotDrop(slot, ev);

    ev.preventDefault();
    ev.stopPropagation();
  },
}
```

For React, you can simply add them like this:

```jsx {2}
<div
  className="mySlot"
  {...theGeneratedListeners}
>
  ...
```

For Vue, you can also generate listeners with `"lowercase"` style (important!), and use them like this:

```xml {2}
<div
  class="mySlot"
  v-on="theGeneratedListeners"
>
  ...
```

### visual feedbacks

When user drag and hover over slot / leave slot,
`onDragHoverStatusChange` of slot will be called and `hoverChanged` event of BlockContext will be fired.

At this point, you shall check `slotHandler.isDragHovering` and `slotHandler.indexToDrop` and update the visual feedbacks.

If `isDragHovering`, the `indexToDrop` is always a valid index number.

Suggestions:

- `isDragHovering`:

  add / remove a dashed outline to the slot

- `indexToDrop`:

  0. If _isDragHovering === false_,
     do not display the indicator.
  1. If _indexToDrop < array.length_,
     find the corresponding block and display a indicator before it.
  2. otherwise, put the indicator after all blocks of this slot.

### compute the position to insert

By default:

- If cursor is hovering over a block of this slot,
  the `indexToDrop` will be the block's index and blocks will be inserted before it.
- otherwise, `indexToDrop` will be `0` for empty slot, or `(largestIndexOfBlocks + 1)` depends on slots items.

You can provide `computeIndexToDrop(request)` while creating SlotHandler, to override the defaults.

The function you provide, shall check whether this slot is droppable and compute the insert position.

Returns:

- `false` to prevent dropping,
- `undefined` to use auto-computed position (which might not accurate),
- `number` the indexToDrop ( <= array.length )

The param `request` contains:

- `clientX`, `clientY`, `offsetX`, `offsetY`
- `currentTarget` -- the HTMLElement
- `ctx` -- BlockContext
- `slot` -- SlotHandler
- `draggingBlocks?` -- array of BlockHandlers, if drag source is current BlockContext
- `dataTransfer?` -- the original dataTransfer object from DragEvent
