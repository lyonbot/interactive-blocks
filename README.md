# copyable-blocks

Select, copy and paste your elements as if a large text input

## Usage

### Determine the way to pass data

It's important to pass data to children. Before writing your component, think and find a solution to pass data ...

#### ... to _direct_ children via ...

- **_Props_**, only if children are **always simply directly nested** and nothing could be complex (which is hardly possible).
- other universal solution (see below), which also works with deeply nested components, could be wiser and robust!

#### ... to (direct or deeply nested) children via ...

- ⭐️ Vue _provide & inject_ ([Vue 3](https://v3.vuejs.org/guide/component-provide-inject.html) / [Vue 2](https://vuejs.org/v2/api/#provide-inject))
- ⭐️ [React Context](https://reactjs.org/docs/context.html)

If the data is a _singleton_, you can also pass it via

- a global store like VueX, Redux, Recoil ...
- ~~global variable on `window`~~

### Root Component

In the root component `<App />`, create a BlockContext.

```js
const blockContext = new BlockContext();
```

`blockContext`, aka `ctx`, is a _singleton_. Each block and slot inside your root component, shall be able to retrieve it.

```xml
data-passing works like this...

<App>                               -- provides `ctx`
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

### Slot Component

In your own slot component...

#### creating

Inherit these data from parent:

- `blockContext`
- `ownerBlock` (can be null if not exist) -- we presume this will not change.

Then, create a Slot Handler. This handler will be provided to children as `ownerSlot`

```js
const parent = ownerBlock || blockContext;  // use `blockContext` if no ownerBlock
const slotHandler = parent.createSlot({
  onCut: (action) => { console.log('cut', action); },
  onPaste: (action) => { console.log('paste', action); },
  onActiveStatusChange: () => { /* change the style if needed */ },
})
```

You shall implement how cutting / pasting blocks works via `onCut`, `onPaste`.

#### beforeDestroy / componentWillUnmount

Dispose the handler when your component is removed.

```js
slotHandler.dispose()
```

#### handing DOM events

Add `pointerup` event handler like this

```js
function handlePointerUp(ev) {
  slotHandler.handlePointerUp();
  // slotHandler.handlePointerUpCapture();  // or if in capture phase

  // make copy / cut / paste keyboard shortcuts work
  // a hidden input will be focused
  if (document.activeElement === ev.currentTarget) slotHandler.ctx.focus();
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

1. Inactive *-- eg. gray*
2. Active but not focused *-- eg. dim blue*
3. Active and focused *-- eg. bright blue*

To observe `blockContext.hasFocus`:

- Add event listener with `blockContext.on("focus", ...)`
- Add event listener with `blockContext.on("blur", ...)`

To observe `slotHandler.isActive`:

- See `onActiveStatusChange` when creating slotHandler
- Add event listener with `blockContext.on("activeElementChanged", ...)`, not recommended here

> **BEST PRACTICE**
>
> Let the **root page** observe `blockContext.hasFocus`. The slot component shall never observe it.
>
> When blockContext is focused, add a className to the root container, and write css like this
> 
> ```css
> .mySlot {
>   /* status 1 */
> }
>
> .mySlot.isActive {
>   /* status 2 */
>   outline: 1px solid #C33;    
> }
>
> .myPage.hasFocus .mySlot.isActive {
>   /* status 3 */
>   outline: 2px solid #F00; 
> }
> ```

### Block Component

In your own block component...

#### creating

Inherit these data from parent:

- `blockContext`
- `ownerSlot` (can be null if not exist) -- we presume this will not change.

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
blockHandler.dispose()
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

1. Inactive *-- eg. gray*
2. Active but not focused *-- eg. dim blue*
3. Active and focused *-- eg. bright blue*

To observe `blockContext.hasFocus`:

- Add event listener with `blockContext.on("focus", ...)`
- Add event listener with `blockContext.on("blur", ...)`

To observe `blockHandler.isActive` and `blockHandler.activeNumber`:

- See `onActiveStatusChange` when creating blockHandler
- Add event listener with `blockContext.on("activeElementChanged", ...)`, not recommended here

> **BEST PRACTICE**
>
> Let the **root page** observe `blockContext.hasFocus`. The block component shall never observe it.
>
> When blockContext is focused, add a className to the root container, and write css like this
> 
> ```css
> .myBlock {
>   /* status 1 */
> }
>
> .myBlock.isActive {
>   /* status 2 */
>   outline: 1px solid #C33;    
> }
>
> .myPage.hasFocus .myBlock.isActive {
>   /* status 3 */
>   outline: 2px solid #F00; 
> }
> ```
