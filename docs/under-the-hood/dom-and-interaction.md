# DOM and Interaction

## Select and Focus

InteractiveBlocks use `pointerdown` event to update the selection, and use focus-shifting events (`focusin` if not focused, or `focusout` if focused) to update the context's `hasFocus` status.

We don't rely on barely focus-shifting events or keyboard events because:

- We want to make the selecting interaction simple
- Don't waste too many time on false alarms, eg. browser lost / regain focus

### Global PointerDown Listener

When setup, the context will bind a global `pointerdown` event listener to document (or ShadowRoot)'s capture phase, which will be called before the event propagates to the corresponding elements.

When user click on something, the listener will use `event.composedPath()` to find what Blocks and Slots are getting clicked and update the selection. If nothing found, which means user click outside of this context, then we shall clear selection.

The selection is stored in the context's `activeBlocks` and `activeSlot` properties. If the selection changes, we emit `statusUpdate` events on all selected and unselected elements, then `selectionChange` event on the context.

### Focus-shifting Events

We update the context's `hasFocus` status when these events fire:

- `focusout`: if the context is focused and the "relatedTarget" is not a known DOMElement
  - set `hasFocus` to true
  - add interaction listeners (eg. keydown) to Document / ShadowRoot
  - emit `statusUpdate` events on all selected elements, then `focus` event on the context.

- `focusin`: if the context is NOT focused and the "target" is a known DOMElement
  - set `hasFocus` to false
  - remove interaction listeners from Document / ShadowRoot
  - emit `statusUpdate` events on all selected elements, then `blur` event on the context.

Note: There is a `Map<DOMElement, IBSlot | IBBlock>` inside the context, and it gets updated when user updates `domElement` property of IBSlot / IBBlock. If one DOMElement exists in the map, it will be treat as a *known DOMElement* to this context.

<br />

## Interaction Listeners - when Focused

When the context `hasFocus`, the browser's focus is on a DOM element of a block or slot. Usually the DOM element is a `<div>`.

We add global `keydown`, `cut`, `copy`, `paste` event listeners to document's capture phase, so that we can handle interactions like **Ctrl-A**, **ArrowDown** and so on.

These listeners will be removed when the context lost focus, or the context is disposed.

Those event listener may prevent other listeners. If a listener handle events successfully (for example, a shortcut keys), it will prevent events' propagation. This could affect your own DOM event listeners.

### Clipboard
