<template>
  <ib-slot class="mySlot" v-model="safeValue">
    <my-block v-for="(item, index) in safeValue" :key="index" :index="index" :value="item" />

    <button class="mySlot-addButton" @click="addItem">+</button>
  </ib-slot>
</template>

<script>
import { IbSlot } from "@lyonbot/interactive-blocks-vue2";

export default {
  name: "MySlot",
  components: {
    IbSlot,
    MyBlock: () => import("./MyBlock.vue").then((m) => m.default), // circular dependency: MyBlock -> MySlot -> MyBlock
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: { required: true }, // Array, but could be undefined
  },

  computed: {
    // use `get()` to avoid problems when "value" is null or undefined
    // use `set(val)` to accept changes from <ib-slot> and pass it to MySlot's parent
    safeValue: {
      get() {
        return this.value || [];
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },

  methods: {
    addItem() {
      const newItem = { name: "new item" };

      if (!this.value) {
        // original value is undefined, make a new array
        this.$emit("change", [newItem]);
      } else {
        // original value is already an array, mutate it
        this.value.push(newItem);
        this.$emit("change", this.value);
      }
    },
  },
};
</script>
