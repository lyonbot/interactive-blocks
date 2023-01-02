<template>
  <ib-block class="myBlock" :index="index" :value="value">
    <input type="text" v-model="value.name" class="myBlock-name" />

    <my-slot v-model="value.children" />
  </ib-block>
</template>

<script>
import { IbBlock } from "@lyonbot/interactive-blocks-vue2";

export default {
  components: {
    IbBlock,
    MySlot: () => import("./MySlot.vue").then((x) => x.default), // circular dependency
  },
  props: {
    index: { type: Number, required: true },
    value: { type: Object, required: true },
  },
};
</script>
