<template>
  <ib-slot
    class="mySlot"
    v-model="safeValue"
  >

    <my-block
      v-for="(item,index) in safeValue"
      :key="index"
      :index="index"
      :value="item"
    />

    <button
      class="mySlot-addButton"
      @click="addItem"
    >+</button>

  </ib-slot>
</template>

<script>
import { IbSlot } from '@lyonbot/interactive-blocks-vue2'

export default {
  name: 'MySlot',
  components: {
    IbSlot,
    MyBlock: () => import('./MyBlock.vue').then(m => m.default),  // circular dependency: MyBlock -> MySlot -> MyBlock
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { required: true },
  },

  computed: {
    // in case "value" received null or undefined
    // and handle <ib-slot> 's v-model
    safeValue: {
      get() {
        return this.value || [];
      },
      set(val) {
        this.$emit('change', val);
      },
    }
  },

  methods: {
    addItem() {
      const newList = [...this.safeValue, { name: 'new item' }];
      this.$emit('change', newList);
    }
  }
}
</script>
