# copyable-blocks

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/lyonbot/copyable-blocks/main) ![npm](https://img.shields.io/npm/v/copyable-blocks)

Make blocks and slots (multiple-)selectable, copyable, draggable with cursor and keyboard.

[ [▶️ Try the Demo](https://lyonbot.github.io/copyable-blocks/) ] [ [📁 View on GitHub](https://github.com/lyonbot/copyable-blocks) ]

## Guide

```
npm i copyable-blocks
```

**NOTE** This part only describes the basic setup, which adds keyboard shortcuts and (multiple) selection supports. To support drag-and-drop, [read this guide _later_](./docs/drag-and-drop.md)

### 🤔 Determine the way to pass data

copyable-blocks works with most MV\* frameworks including React, Vue.

Before writing your component, determine a way to pass data, based on your framework...

Passing with **props** works smoothly with simple node structure. However, once the structure get complex,
you will have to write lots of duplicated code to receive and pass props.

Hence, I suggest that you use **Context** or **Provide & Inject**, based on your framework.

- ⭐️ React: [Context](https://reactjs.org/docs/context.html)
- ⭐️ Vue: provide & inject ([Vue 3](https://v3.vuejs.org/guide/component-provide-inject.html) / [Vue 2](https://vuejs.org/v2/api/#provide-inject))

If the data is a _singleton_ (eg. the `blockContext`), you can also pass it via

- a global store like VueX, Redux, Recoil ...
- ~~global variable on `window`~~

Now let's start writing the components:

1. MyApp (Root Component)
2. MySlot (Slot Component)
3. MyBlock (Block Component)

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

### 🧩 Root Component

#### creating

In the root component `<App />`, create a BlockContext.

```js
const blockContext = new BlockContext();
```

`blockContext`, aka `ctx`, is a _singleton_. Each block and slot inside `<App />`, shall be able to retrieve it.

#### beforeDestroy / componentWillUnmount

Once the component is about to be removed, call this:

```js
blockContext.dispose();
```

#### handing events

You can add event listeners to `blockContext.on("event-name", callback)`

- **activeElementChanged** `(ctx: BlockContext)`
- **focus** `(ctx: BlockContext)`
- **blur** `(ctx: BlockContext)`
- **paste** `(action: CBPasteAction)`
- **cut** `(action: CBCutAction)`

In general, you don't need to listen `paste`, `cut` events of `blockContext` here -- when you create a Slot Handler, you may implement and provide correspond callbacks there.

Additionally, to support drag-and-drop, please read [./docs/drag-and-drop.md](./docs/drag-and-drop.md)

#### hasFocus and keyboard shortcuts

BlockContext handles keyboard and clipboard events via a hidden input (`blockContext.hiddenInput`). Therefore, keyboard shortcuts (`Ctrl+C`, `Ctrl+V`, arrow keys...) work only when **hiddenInput** is focused.

- To check whether it is focused, read `blockContext.hasFocus`.

- To observe the status, add event listeners to `focus` and `blur` events.

- To focus on it, call `blockContext.focus()`

When `hasFocus` is true, it's suggested to add a visual feedback (an outline, for example) to the root component.

If you want to implement more keyboard shortcuts, call `blockContext.hiddenInput.addEventListener('keydown', ...)`

<br/>

### 🧩 Slot Component

In your own slot component...

#### creating

Inherit these data from parent:

- `blockContext`
- `ownerBlock` (can be _null_ for the outermost slot)

Then, create a Slot Handler. This handler will be provided to children as `ownerSlot`

```js
const parent = ownerBlock || blockContext; // use `blockContext` if no ownerBlock
const slotHandler = parent.createSlot({
  onCut: (action) => {
    console.log("cut", action);
  },
  onPaste: (action) => {
    console.log("paste", action);
  }, // call `action.preventDefault()` to prevent pasting
  onActiveStatusChange: () => {
    /* change the style if needed */
  },
});
```

You shall implement how cutting / pasting blocks works via `onCut`, `onPaste`.

#### beforeDestroy / componentWillUnmount

Dispose the handler when your component is removed.

```js
slotHandler.dispose();
```

#### handing DOM events

Add `pointerup` event handler like this

```js
function handlePointerUp(ev) {
  slotHandler.handlePointerUp();
  // slotHandler.handlePointerUpCapture();  // or if in capture phase

  // make copy / cut / paste keyboard shortcuts work
  // a hidden input will be focused
  if (document.activeElement === ev.currentTarget) blockContext.focus();
}
```

In the HTML template, `tabIndex` must be set to `-1` so that we can correctly handle users' clicks and transfer the focus point to our keyboard shortcut handler (a hidden input box).

```xml
<div onPointerUp={handlePointerUp} tabIndex="-1">
  TODO: render children here.

  render your own Block components here.
</div>
```

#### render child blocks

`slotHandler` must be passed as `ownerSlot` to child blocks.

#### visual feedbacks

Keyboard shortcuts (Ctrl + V) works on this slot only if `(blockContext.hasFocus && slotHandler.isActive)`

Hence, three status shall be considered:

1. Inactive _-- eg. gray_
2. Active but not focused _-- eg. dim blue_
3. Active and focused _-- eg. bright blue_

To observe `blockContext.hasFocus`:

- Add event listener with `blockContext.on("focus", ...)`
- Add event listener with `blockContext.on("blur", ...)`

To observe `slotHandler.isActive`:

- See `onActiveStatusChange` when creating slotHandler
- Add event listener with `blockContext.on("activeElementChanged", ...)`, not recommended here

> **BEST PRACTICE**
>
> In your slot component, **DO NOT** add listeners to `blockContext` -- let the **root component** do that.
>
> When blockContext is focused, let the **root component** add a className to its DOM element.
>
> Then, write the stylesheets like this:
>
> ```css
> .mySlot {
>   /* status 1 */
> }
>
> .mySlot.isActive {
>   /* status 2 */
>   outline: 1px solid #c33;
> }
>
> .myPage.hasFocus .mySlot.isActive {
>   /* status 3 */
>   outline: 2px solid #f00;
> }
> ```

<br/>

### 🧩 Block Component

In your own block component...

#### creating

Inherit these data from parent:

- `blockContext`
- `ownerSlot` (can be _null_ for the outermost block)

Then, create a Block Handler. This handler will be provided to children as `ownerBlock`

```js
const parent = ownerSlot || blockContext;  // use `blockContext` if no ownerSlot
const blockHandler = parent.createBlock({
  data: () => ...,  // data getter function, returns an object
  index: () => ..., // index getter function, returns an number
  onActiveStatusChange: () => { /* change the style if needed */ },
})
```

You shall implement `data` and `index` handler. They will be called when:

- Selecting
- Copying and pasting
- Accessing `blockHandler.data` or `blockHandler.index` (computed property)

The return value of `data` getter, may has a `toJSON()` method, which will be called while copying blocks and affect `paste` events of slots.

#### beforeDestroy / componentWillUnmount

Dispose the handler when your component is removed.

```js
blockHandler.dispose();
```

#### handing DOM events

Add `pointerup` event handler like this

```js
function handlePointerUp(ev) {
  blockHandler.handlePointerUp();
  // blockHandler.handlePointerUpCapture();  // or if in capture phase

  // make copy / cut / paste keyboard shortcuts work
  // a hidden input will be focused
  if (document.activeElement === ev.currentTarget) blockContext.focus();
}
```

In the HTML template, `tabIndex` must be set to `-1` so that we can correctly handle users' clicks and transfer the focus point to our keyboard shortcut handler (a hidden input box).

```xml
<div onPointerUp={handlePointerUp} tabIndex="-1">

  This is your card. render something here.

  You can also render your Slot components here.

</div>
```

#### render child slots

`blockHandler` must be passed as `ownerBlock` to child slots, when rendering children.

#### visual feedbacks

Keyboard shortcuts (Ctrl + V) works on this block only if `(blockContext.hasFocus && blockHandler.isActive)`.

Additionally, `blockHandler.activeNumber` will be 0, 1, 2... if multiple blocks are active (selected)!

Hence, three status shall be considered:

1. Inactive _-- eg. gray_
2. Active but not focused _-- eg. dim blue_
3. Active and focused _-- eg. bright blue_

To observe `blockContext.hasFocus`:

- Add event listener with `blockContext.on("focus", ...)`
- Add event listener with `blockContext.on("blur", ...)`

To observe `blockHandler.isActive` and `blockHandler.activeNumber`:

- See `onActiveStatusChange` when creating blockHandler
- Add event listener with `blockContext.on("activeElementChanged", ...)`, not recommended here

> **BEST PRACTICE**
>
> In your block component, **DO NOT** add listeners to `blockContext` -- let the **root component** do that.
>
> When blockContext is focused, let the **root component** add a className to its DOM element.
>
> Then, write the stylesheets like this:
>
> ```css
> .myBlock {
>   /* status 1 */
> }
>
> .myBlock.isActive {
>   /* status 2 */
>   outline: 1px solid #c33;
> }
>
> .myPage.hasFocus .myBlock.isActive {
>   /* status 3 */
>   outline: 2px solid #f00;
> }
> ```
