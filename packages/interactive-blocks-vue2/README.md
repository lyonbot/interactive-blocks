# @lyonbot/interactive-blocks-vue2

This package helps you integrate [interactive-blocks](https://lyonbot.github.io/interactive-blocks/) to your Vue2 project.

- [Example Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/example-vue2-simple) | [Try with StackBlitz](https://stackblitz.com/github/lyonbot/interactive-blocks/tree/main/packages/example-vue2-simple) | [Source Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/interactive-blocks-vue2)

## Usage

The starter guide is moved to the [Example Code](https://github.com/lyonbot/interactive-blocks/tree/main/packages/example-vue2-simple)

### 🧩 Provide Data to `<ib-block>`

You must provide `index` and `value` props. If the block has no index, just pass zero.
Both of them can be a getter function.

### 🧩 Bind your Array to `<ib-slot>`

You must choose one of these ways to pass the array:

- **Approach 1**: `<ib-slot v-model="item.children">`

  This is preferred. When the array content is changed, a new array is created and submitted via `change` event.

- **Approach 2**: `<ib-slot :list="item.children">`

  When the array content is changed, the array is directly updated.

### 💅 Styling

(for `<ib-slot>` and `<ib-block>`)

When blocks and slots get active and focused, they will get `class="isActive"` and / or `class="hasFocus"`.

We don't provide default styles. Please implement your own styles.

- To use other class names, set `is-active-class="my-active-class"` and `has-focus-class="my-focus-class"`

- To use other tag name rather than "div", set `tag-name="section"`


### ✈️ Copy, Paste, Data Transform

When copy a block, we directly serialize `value` of `<ib-block>` to JSON, and write to clipboard.

When paste one or more blocks, the JSON objects will be directly pushed into the array that bound to `<ib-slot>`

If you want to transform the data, before pushing into the array, you can set `transform-data="myTransformMethod"` to `<ib-slot>`. For example:

```js
myTransformMethod(rawObject) {
  return {
    ...rawObject,
    id: uuid(),  // always make a new id when pasting
  }
}
```
