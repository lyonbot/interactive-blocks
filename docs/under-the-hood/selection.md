# Selection

## Single Selection

### Rules

1. _selectedSlot_ must be adjacent to the _selectedBlock_, `abs(slot.depth - block.depth) <= 1`

<br />

## Multiple Selection

### Rules

1. All selected blocks must under the same slot, and the selected slot must be `block.parent` of each block.

2. If one block doesn't meet this rule, we find the nearest ancestor block that satisfies, and select it rather

To meet the rules, we can lift all selected blocks until they get same `depth`, then continue lifting until their `parent` not vary anymore. (Lift = select parent block)

### Types

We define 3 types of multiple-selecting:

- `none`: clear old selection
- `ctrl`: make discontinuous selection
- `shift`: making a continuous selection from the _nearest_ selected one to the new block
