# Under the Hood

## Terms

- **Block**: an item that can be selected, copied, or moved. Its `data` shall be a JavaScript object.

- **Slot**: a list containing various blocks. It also process block's inserting, moving and removing, based on the handlers you implemented. Its `data` shall be a JavaScript array.

- **Context**: an InteractiveBlock context instance, which manages blocks, slots, browser events, focus status and so on.

- **Element**: a HTMLElement that presents as a slot, or a block

- **Ancestors**: parent elements, grand-parents and so on

<br />

## Ability Modules

- **core**: select elements, focus, serialize and deserialize blocks
- **navigate**: navigate and select blocks with keyboard
- **clipboard**:  handle "copy" "paste" and "cut" events
- **drag**: drag to move blocks

### How modules get composited together

We implements a simplified 

<br />

## Select and Focus

### Phase 1: PointerDown

The event propagates like this:

1. **capture phase**: document -> (ancestor elements) -> current element
2. **bubble phase**: current element -> (ancestor elements in reversed order) -> document

When setup, the context will bind a global pointerdown event listener to document, which will be called before all event listeners.

Then when you render a block and slot element, you shall bind pointerdown listener to it. It can be in capture phase or bubble phase. You can get the listener function from `SlotHandler` or `BlockHandler`.

When user click on something:

- The global listener will bind "phase 2" listeners to global `blur`, `pointerup` events' capture phase so we can sense interactions and reacts.

- If cursor is inside a slot or block, the element listeners that you bound will be called one-by-one. We find out the current element and its ancestors, following the event's propagation. The element list will be stored in the context, as `pointerDownTrace` -- an internal variable.

Beware that the browser's focus is not shifted yet, the `document.activeElement` is not changed.

### Phase 2: Focus or PointerUp

If the user clicked another slot or block, the browser's focus will be shifted now, and `blur` and `focus` events will fire. Then, we do these procedure in document's global `blur` event listener.

- remove global `blur`, `pointerup` event listeners, if bound

- update context's focus status -- `hasFocus`
  
  - We check whether `activeElement` (aka. blur event's `relatedTarget`) is exactly your DOM element. If so, we think the context is focused.
  
  - Otherwise, the context is not focused. At this moment, some elements could still be active -- maybe user just clicked on a text input inside your block element, and the input box is focused rather than this context.

- update context's `activeBlocks` and `activeSlot`
  
  - if context's `pointerDownTrace` is not empty, it means that a slot or block element is clicked. We update context's current active blocks and slot.
  
  - otherwise, the click happens outside this context -- nothing is selected.

- if `activeBlocks` and `activeSlot` changes, the context emits **activeElementChanged** event

- if `ctx.hasFocus` changes, the context emits its own **blur** or **focus** event, and notify both previously-activated elements and current active elements

Beware that if a user double-click the same element, the `activeElement` will not change and `blur` event will not fire. Therefore, we shall do the procedure above too, in global `pointerup` event listener.

<br />

## Actions when Focused

When the context `hasFocus`, the browser's focus is on a block or slot element, which could not be a input. We add global `keydown`, `cut`, `copy`, `paste` event listeners to document's capture phase.

These listeners will be removed when the context lost focus, or the context is disposed.

Those event listener is bold -- if they handle events successfully, they will prevent events' propagation. If you have some logic based on those DOM events, your own listeners could not be called.

### Clipboard
