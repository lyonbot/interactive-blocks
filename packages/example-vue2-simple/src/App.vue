<template>
  <div>
    <h1><a href="https://github.com/lyonbot/interactive-blocks">InteractiveBlocks</a> x Vue</h1>
    <p>select some child cards, and press arrow keys, Ctrl+A, Ctrl+C, Ctrl+V etc</p>

    <ib-root>
      <my-block
        :index="0"
        :value="store"
      />
    </ib-root>
  </div>
</template>

<script>
import { IbRoot } from '@lyonbot/interactive-blocks-vue2'
import MyBlock from './MyBlock.vue'

export default {
  components: {
    IbRoot,
    MyBlock
  },
  data() {
    return {
      store: {
        name: "root card",
        children: [
          { name: "child1" },
          { name: "child2" },
        ],
      }
    }
  }
}
</script>
