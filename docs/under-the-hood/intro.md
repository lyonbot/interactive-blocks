# Under the Hood

## Terms

- **Block**: an item that can be selected, copied, or moved. Its `data` shall be a JavaScript object.

- **Slot**: a list containing various blocks. It also process block's inserting, moving and removing, based on the handlers you implemented. Its `data` shall be a JavaScript array.

- **Context**: an InteractiveBlocks context instance, which manages blocks, slots, browser events, focus status and so on.

- **Element**: a slot, or a block. This is an abstract concept. An element must have a corresponding `domElement` to display on the browser.

- **Ancestors**: parent elements, grand-parents and so on

## Modules of Abilities

- **core**: select elements, focus, serialize and deserialize blocks
- **navigate**: navigate and select blocks with keyboard
- **clipboard**: handle "copy" "paste" and "cut" events
- **drag**: drag to move blocks

## How modules get composited together

We implements a simplified
