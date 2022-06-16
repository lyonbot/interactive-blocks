# @lyonbot/interactive-blocks-vue2

This package helps you integrate [interactive-blocks](https://lyonbot.github.io/interactive-blocks/) to your Vue2 project.

- [Example Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/example-vue2-simple) | [Try with StackBlitz](https://stackblitz.com/github/lyonbot/interactive-blocks/tree/main/packages/example-vue2-simple) | [Source Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/interactive-blocks-vue2)

## Usage

It's too tedious to describe. Please check out the [Example Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/example-vue2-simple)

Here are some points that need attention.

### 💅 Styling

When blocks and slots get active and focused, they will get `isActive` and `hasFocus` classes.

You can change this name by passing `is-active-class="my-active-class"` and `has-focus-class="my-focus-class"` to the component.

You can use `tag-name="section"` to use other dom tag name rather than "div".

We don't provide default styles. Please implement your own styles.

### 🧩 Provide Data to `<ib-block>`

You must provide `index` and `value` props. If the block has no index, just pass zero.
Both of them can be a getter function.

### 🧩 Bind your Array to `<ib-slot>`

You must choose one of these ways to pass the array:

- **Approach 1**: `<ib-slot v-model="item.children">`

  This is preferred. When the array content is changed, a new array is created and submitted via `change` event.

- **Approach 2**: `<ib-slot :list="item.children">`

  When the array content is changed, the array is directly updated.

### ✈️ Data Transformation

Copying and pasting will take `value` prop from `<ib-block>`

You can set `transfrom-data="myTransfromMethod"` to `<ib-slot>`, and it will transform the data while pasting, before pushing into the array.

- `myTransfromMethod` takes the value and returns a new value.
