# Example of @lyonbot/interactive-blocks-vue2

This example use [vite](https://vitejs.dev/) to build and start. [Try with StackBlitz](https://stackblitz.com/github/lyonbot/interactive-blocks/tree/main/packages/example-vue2-simple)

Checkout these files:

- [src/App.vue](src/App.vue) - the whole App

  - Use `<ib-root>` to wrap your custom Block and Slot components

- [src/MySlot.vue](src/MySlot.vue) - custom Slot Component to list blocks

  - Use `<ib-slot v-model="array">` to wrap your block list
  - It might yield new `array`. Your custom Slot Component must handle it and pass it to your parent. See the `safeValue` in the example.

- [src/MyBlock.vue](src/MyBlock.vue) - custom Block Component to render a block
  - Use `<ib-block :index="index" :value="value">` to wrap your content
  - You can also put a nested Slot inside it

Note: Vue might meet the circular dependency problem. We use `() => import(...)` inside `components` to solve it.

## Integrating Guide

All you need is already elaborated above and presented in `src`.

For further info, see <https://github.com/lyonbot/interactive-blocks/blob/main/packages/interactive-blocks-vue2/README.md>
