# Under the Hood

## DOM Events

InteractiveBlocks's `hasFocus` will flicker when user click. The reason is presented here:

- **PointerDown**

- _activeElement changed_

- **Blur event**

  - if `ctx.hasFocus`, turn into `false` and remove previously attached interaction listeners.

- **Focus event**

- **PointerUp event**

  - The event bubbles through slots and blocks, `ctx.isFocusingBlock` and `ctx.isFocusingSlot` _(temp vars)_ will be updated

  - Finally bubbles to `document.body`, which `ctx` is listening

    - remove `document.body` PointerUp listener
    - copy `ctx.isFocusingBlock` and `ctx.isFocusingSlot` and reset them for next clicking
    - if some block or slot is focused, set `ctx.hasFocus` to `true` and attach interaction listeners to `document.body`.

The interaction listeners are

- `cut`, `copy` and `paste`
- `keydown` for shortkeys
- `blur` to unset `ctx.hasFocus` and remove interaction events
