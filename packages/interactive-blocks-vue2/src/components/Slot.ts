/* eslint-disable @typescript-eslint/ban-ts-comment */

import { SlotInfo } from "@lyonbot/interactive-blocks";
import { IBSlotMixin } from "../mixins";
import type { PropOptions } from "vue";

export const IbSlot = IBSlotMixin.extend({
  name: "IbSlot",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: { /* type: Array, */ default: null } as PropOptions<any[] | undefined | null>,
    list: { type: Array, default: null },

    isActiveClass: { type: String, default: "isActive" },
    hasFocusClass: { type: String, default: "hasFocus" },
    tagName: { type: String, default: "div" },

    // by default "ibHandlePointerUp" event handler will be attached to the element.
    // set to false to prevent if you want to manually attach
    delegateEvents: { type: Boolean, default: true },

    // before pasting items, convert data one-by-one
    transformData: { type: Function, default: null },

    options: { type: Object, default: null },  // other SlotInfo, only works when init
  },
  data() {
    return {
    };
  },
  methods: {
    /**
     * make this slot active and select all content, without focusing
     *
     * note: if BlockContent disabled `multipleSelect`, only the first block will be selected.
     */
    select() {
      return this.ibSlotHandler.select();
    },

    /**
     * make this slot active and move the focus to this BlockContext.
     *
     * note: if another slot was active, all blocks will be unselected.
     */
    focus() {
      return this.ibSlotHandler.focus();
    },

    // ------------------------------- internal -------------------------------

    ibGetOptions() {
      /** check if "value" prop is set, even if it's `undefined` */
      const isUseImmutableMode = () => "value" in this.$props;

      const ans: SlotInfo = {
        ref: this,
        onCut: (action) => {
          if (isUseImmutableMode()) {
            // immutable style -- using "value" prop
            const newList = this.value?.slice() || [];
            action.indexesDescending.forEach((index) => newList.splice(index, 1));
            this.$emit("change", newList);
          } else if (this.list) {
            // mutable style -- using "list" prop
            action.indexesDescending.forEach((index) => this.list.splice(index, 1));
          } else {
            throw new Error("You must provide one of this props: value or list");
          }
        },
        onPaste: (action) => {
          let items = [...action.data.blocksData];
          if (typeof this.transformData === "function") items = items.map(this.transformData as any);

          if (isUseImmutableMode()) {
            // immutable style -- using "value" prop
            const newList = this.value?.slice() || [];
            newList.splice(action.index, 0, ...items);
            this.$emit("change", newList);
          } else if (this.list) {
            // mutable style -- using "list" prop
            this.list.splice(action.index, 0, ...items);
          } else {
            throw new Error("You must provide one of this props: value or list");
          }
        },
        ...this.options,
      };
      return ans;
    },
  },
  render(h) {
    return h(
      this.tagName,
      {
        class: {
          [this.hasFocusClass]: this.ibHasFocus,
          [this.isActiveClass]: this.ibIsActive,
        },
        on: {
          pointerup: this.delegateEvents ? this.ibHandlePointerUp : [],
          ...this.$listeners,
        },
        attrs: {
          tabIndex: "-1",
          ...this.$attrs,
        },
      },
      this.$slots.default
    );
  },
});