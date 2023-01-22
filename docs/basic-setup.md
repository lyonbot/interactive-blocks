# Basic Setup

interactive-blocks works with most MV\* frameworks including React, Vue.

```
npm i @lyonbot/interactive-blocks
```

Or via CDN. global name: `InteractiveBlocks`

- https://unpkg.com/@lyonbot/interactive-blocks
- https://cdn.jsdelivr.net/npm/@lyonbot/interactive-blocks/dist/index.umd.js

In this document, you will learn how to modify and enhance your Root Component, Slot Component and Block Component!

After setup, your components will get these interactive abilities:

- (multiple) selectable!
- copy and paste! with system clipboard
- keyboard shortcuts!
- [see README](../README.md)

To support drag-and-drop, extra effort is required. [Please refer to this _later_](./drag-and-drop.md)

## 🎯 To-do List

- **🧩 Root Component**

  - **create**

    - create a `new BlockContext()`
      - (optional) provide options
    - listen to `blur` and `focus` events, in order to change visual feedbacks

  - **while using**

    - update style when event fires
    - call `blockContext.focus()` if need

  - **style and visual feedbacks**

    - update style when `blur` and `focus` events fire
    - two status based on `blockContext.hasFocus`:
      1. focused
      2. blurred

- **🧩 Slot Component**

  - **create**

    - from ancestors, retrieve `blockContext` and (if exists) `ownerBlock`
    - create a **SlotHandler** with customized ...
      - `onCut(action)` - see examples below
      - `onPaste(action)` - see examples below
      - `onStatusChange()` - a callback to update style
      - (optional) `ref` - custom anything

  - **before destroy**

    - call `slotHandler.dispose()`

  - **render**

    - ensure that children blocks can get `slotHandler` as `ownerSlot`
    - make a `<div>` to wrap children blocks
      - add `tabIndex="-1"`
      - add event listeners from `slotHandler.getDOMEvents()`
      - add style and classNames

  - **style and visual feedbacks**

    - update style when `onStatusChange()` is called
    - There are 3 status based on `isActive, hasFocus` of `slotHandler`

      | Expression              | Status                 | Example Style |
      | ----------------------- | ---------------------- | ------------- |
      | `!isActive`             | not active             | gray          |
      | `isActive && !hasFocus` | active but not focused | dim blue      |
      | `isActive && hasFocus`  | active                 | bright blue   |

- **🧩 Block Component**

  - **create**

    - from ancestors, retrieve `blockContext` and (if exists) `ownerSlot`
    - create a **BlockHandler** with customized ...
      - `data()` - getter function
      - `index()` - getter function
      - `onStatusChange()` - a callback to update style
      - (optional) `ref` - custom anything

  - **before destroy**

    - call `blockHandler.dispose()`

  - **render**

    - ensure that children slots can get `blockHandler` as `ownerBlock`
    - make a `<div>` to wrap block content (including possible sub-slots)
      - add `tabIndex="-1"`
      - add event listeners from `blockHandler.getDOMEvents()`
      - add style and classNames

  - **style and visual feedbacks**

    - update style when `onStatusChange()` is called
    - There are 3 status based on `isActive, hasFocus` of `blockHandler`

      | Expression              | Status                 | Example Style |
      | ----------------------- | ---------------------- | ------------- |
      | `!isActive`             | not active             | gray          |
      | `isActive && !hasFocus` | active but not focused | dim blue      |
      | `isActive && hasFocus`  | active (aka. selected) | bright blue   |

    - (optional) if selected, display `blockHandler.activeNumber` - the order number in current selection

## 🤔 The correct way to pass data

As described above, a component have to retrieve something from its parent and ancestors; a component might pass something to children and descendants.

Passing with **props** is simple, but also limited. It only works smoothly with directly-contained children.

There are better ways to pass data to deeply nested children (aka. descendants):

- ⭐️ React: [Context](https://reactjs.org/docs/context.html)
- ⭐️ Vue: provide & inject ([Vue 3](https://v3.vuejs.org/guide/component-provide-inject.html) / [Vue 2](https://vuejs.org/v2/api/#provide-inject))

As described, at least we need to develop 3 components:

1. MyApp (Root Component) -- the root, provides `blockContext` for descendants
2. MySlot (Slot Component)
3. MyBlock (Block Component)

A hierarchical structure sample is presented below:

```xml
<App>                               -- provides `ctx` the blockContext
  <Slot ctx=... ownerBlock=null >      -- provides `ownerSlot`
    <Block ctx=... ownerSlot=... />
    <Block ctx=... ownerSlot=... />
    <Block ctx=... ownerSlot=... >       -- provides `ownerBlock`
      <Slot ctx=... ownerBlock=... >       -- provides new `ownerSlot`
        <Block ctx=... ownerSlot=... />
      </Slot>
      <Slot ctx=... ownerBlock=... >       -- provides new `ownerSlot`
      </Slot>
    </Block>
  </Slot>
</App>
```

<br/>

## 🧩 Root Component

### creating

In the root component `<App />`, create a BlockContext.

```js
import { BlockContext } from "@lyonbot/interactive-blocks";

const blockContext = new BlockContext();
```

`blockContext`, aka `ctx`, is a _singleton_. Each block and slot inside `<App />`, shall be able to retrieve it.

#### BlockContextOptions

You can provide options like `new BlockContext({ ... })`. All options are described in TypeScript and your IDE shall be able to show the instructions with autocompletion.

Special Notice: you may provide `brand: "xxx"` to distinguish the usage of this BlockContext.
For example: "files", "tasks", "workflow", "dependencies". Data between differently branded BlockContexts is NOT sharable.

### before destroy

Once the component is about to be removed, call this:

```js
blockContext.dispose();
```

### handing events

If you want, you can add event listeners to BlockContext.

```js
blockContext.on("focus", () => {
  console.log("Keyboard shortcuts available now!");
});

blockContext.on("blur", () => {
  console.log("Keyboard shortcuts unavailable! Click a block / slot to active.");
});
```

- **selectionChange** `(ctx: BlockContext)`
- **focus** `(ctx: BlockContext)`
- **blur** `(ctx: BlockContext)`
- **paste** `(action: CBPasteAction)`
- **cut** `(action: CBCutAction)`

In general, you don't need to listen `paste`, `cut` events of `blockContext` here -- when you create a Slot Handler, you may implement and provide correspond callbacks there.

Additionally, drag-and-drop will introduces some extra events, please read [drag-and-drop.md](./drag-and-drop.md) later.

### `hasFocus` and keyboard shortcuts

All keyboard shortcuts (`Ctrl+C`, `Ctrl+V`, arrow keys...) work only when `hasFocus`.

- To check whether it is focused, read `blockContext.hasFocus`.

- To observe the status, add event listeners to `focus` and `blur` events.

- To focus on it, call `blockContext.focus()`

When `hasFocus` is true, it's suggested to add a visual feedback (an outline, for example) to the root component.

To implement more keyboard shortcuts:

```js
blockContext.on("keydown", (event, ctx) => {
  if (event.keyCode === "F12") {
    console.log("Hello World");
    event.preventDefault();
  }
});
```

<br/>

## 🧩 Slot Component

In your own slot component...

### creating

Inherit these data from parent:

- `blockContext`
- `ownerBlock` (can be _null_ for the outermost slot)

Then, create a Slot Handler. This handler will be provided to children as `ownerSlot`

```js
// import a util function to implement a simple `onCut` callback
import { removeItems } from "@lyonbot/interactive-blocks";

const parent = ownerBlock || blockContext; // use `blockContext` if no ownerBlock
const slotHandler = parent.createSlot({
  onCut: (action) => {
    console.log("cut", action);

    // example: delete blocks from this slot

    const indexes = action.blocks.map((block) => block.index);
    removeItems(theActualArray, indexes);
  },
  onPaste: (action) => {
    console.log("paste", action);

    // example: process data from clipboard and add to this slot

    const rawBlocksData = action.data.blocksData; // object array from clipboard
    const blocks = rawBlocksData.map((item) => makeBlockFromRawData(item)); // process the data from clipboard
    theActualArray.splice(action.index, 0, ...blocks); // insert into the array

    // or, call `action.preventDefault()` to prevent pasting
  },
  onStatusChange: () => {
    /* change the style if needed */
  },
});
```

#### Define the Behaviors

You shall implement how cutting / pasting blocks works via `onCut`, `onPaste`.

Example code is presented above.

#### Attach a Ref

Optionally, you can attach `this` of your component, to `slotHandler.ref`,
so you will be able to access the component instance somewhere else later.

```js
const slotHandler = parent.createSlot({
  ref: this, // --> slotHandler.ref
  // ...
});
```

### before destroy

Dispose the handler when your component is removed.

```js
slotHandler.dispose();
```

### render & DOM events

First of all, ensure that children blocks can get `slotHandler` as `ownerSlot`

Then you can make a `<div>` to wrap children blocks. On the `<div>`:

- add `tabIndex="-1"`
- add event listeners from `slotHandler.getDOMEvents()`

The `tabIndex` must be set to `-1` so that we can correctly handle users' clicks and keyboard events.

If you need to render child blocks, `slotHandler` must be passed as `ownerSlot` to them!

#### getDOMEvents() and frameworks

React

```jsx
const domEvents = slotHandler.getDOMEvents("react"); // => { onPointerUp: ... }
// .                                       ^^^^^^^

<div tabIndex={-1} {...domEvents}>
  {
    /* render your own Block components here. example: */

    items.map((item, index) => (
      <MyBlock
        key={index}
        ownerSlot={slotHandler}
        index={index}
        data={item}
        onChange={...}
      />
    ))
  }
</div>;
```

Vue 2

```jsx
// in created()
this.domEvents = slotHandler.getDOMEvents(); // => { pointerup: ... }
```

```xml
<div tabindex="-1" v-on="domEvents">
  <!-- render your own Block components here. example: -->
  <MyBlock
    v-for="(item, index) in items"
    :key="index"
    :ownerSlot="slotHandler"
    :index="index"
    :data.sync="item"
  />
</div>
```

### visual feedbacks

You shall update style when `onStatusChange()` is called. For example, add `class="..."` to the `<div>`

There are 3 status based on `isActive, hasFocus` of `slotHandler`

| Expression              | Status                 | Example Style |
| ----------------------- | ---------------------- | ------------- |
| `!isActive`             | not active             | gray          |
| `isActive && !hasFocus` | active but not focused | dim blue      |
| `isActive && hasFocus`  | active                 | bright blue   |

<br/>

## 🧩 Block Component

In your own block component...

### creating

Inherit these data from parent:

- `blockContext`
- `ownerSlot` (can be _null_ for the outermost block)

Then, create a Block Handler. This handler will be provided to children as `ownerBlock`

```js
const parent = ownerSlot || blockContext;  // use `blockContext` if no ownerSlot
const blockHandler = parent.createBlock({
  data: () => ...,  // data getter, must return an object
  index: () => ..., // index getter, must return a number
  onStatusChange: () => { /* change the style if needed */ },
})
```

#### data and index

You shall provide two **getter functions**: `data` and `index`. They will be called when:

- Users make a selection
- Users copy and paste -- `data` affects the clipboard!
- You read `blockHandler.data` or `blockHandler.index` values (they are computed property)

If the returned value of `data()` have a `toJSON()` method, it will affect the data in `paste` events of slots.

#### Attach a Ref

Optionally, you can attach `this` of your component, to `blockHandler.ref`,
so you will be able to access the component instance somewhere else later.

```js
const blockHandler = parent.createBlock({
  ref: this, // --> blockHandler.ref
  // ...
});
```

### before destroy

Dispose the handler when your component is removed.

```js
blockHandler.dispose();
```

### render & DOM events

First of all, ensure that children slots can get `blockHandler` as `ownerBlock`.

Then you can make a `<div>` to wrap block content (including possible sub-slots). On the `<div>`:

- add `tabIndex="-1"`
- add event listeners from `blockHandler.getDOMEvents()`

The `tabIndex` must be set to `-1` so that we can correctly handle users' clicks and keyboard events.

#### getDOMEvents() and frameworks

React

```jsx
const domEvents = blockHandler.getDOMEvents("react"); // => { onPointerUp: ... }
// .                                        ^^^^^^^

<div tabIndex={-1} {...domEvents}>
  {/* this is your card. render something here */}
  <p>Block {data.xxxx}</p>

  {/* you can also render sub-items with custom Slot component */}
  <MySlot items={data.children} ownerBlock={blockHandler} onChange={...} />
</div>;
```

Vue 2

```jsx
// in created()
this.domEvents = blockHandler.getDOMEvents(); // => { pointerup: ... }
```

```xml
<div tabindex="-1" v-on="domEvents">
  <!-- this is your card. render something here -->
  <p>Block {{data.xxxx}}</p>

  <!-- you can also render sub-items with custom Slot component -->
  <MySlot :items.sync="data.children" :ownerBlock="blockHandler" />
</div>
```

### visual feedbacks

You shall update style when `onStatusChange()` is called. For example, add `class="..."` to the `<div>`

There are 3 status based on `isActive, hasFocus` of `blockHandler`

| Expression              | Status                 | Example Style |
| ----------------------- | ---------------------- | ------------- |
| `!isActive`             | not active             | gray          |
| `isActive && !hasFocus` | active but not focused | dim blue      |
| `isActive && hasFocus`  | active (aka. selected) | bright blue   |

Additionally, if selected, you may display `blockHandler.activeNumber` in the block.
It's the order number in current selection, which could be `0, 1, 2...` if selected, or `false` if not selected!
