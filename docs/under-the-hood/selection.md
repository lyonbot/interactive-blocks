# Selection

## Single Selection

### Rules

1. _selectedSlot_ must be adjacent to the _selectedBlock_, `abs(slot.depth - block.depth) <= 1`

<br />

## Multiple Selection

### Rules

1. All selected blocks must under the same slot.

2. If one block doesn't meet this rule, we find the nearest ancestor that satisfies, and select it rather

3. The `ctx.selectedSlot` must be to the parent of each selected block.

### Types

We define 3 types of multiple-selecting:

- `none`: clear old selection
- `ctrl`: make discontinuous selection
- `shift`: making a continuous selection from the _nearest_ selected one to the new block
