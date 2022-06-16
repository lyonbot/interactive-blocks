<template>
  <ib-block
    class="myBlock"
    :index="index"
    :value="value"
  >
    <input
      type="text"
      v-model="value.name"
      class="myBlock-name"
    />

    <my-slot v-model="value.children" />
  </ib-block>
</template>

<script>
import { IbBlock } from '@lyonbot/interactive-blocks-vue2'
import MySlot from './MySlot.vue'

export default {
  components: { IbBlock, MySlot },
  props:
  {
    index: { type: Number, required: true, },
    value: { type: Object, required: true, },
  }
}
</script>
