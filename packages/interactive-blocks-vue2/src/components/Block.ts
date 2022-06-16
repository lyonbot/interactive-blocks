/* eslint-disable @typescript-eslint/ban-ts-comment */

import { BlockInfo } from "@lyonbot/interactive-blocks";
import { IBBlockMixin } from "../mixins";
import { toValue } from "./util";


export const IbBlock = IBBlockMixin.extend({
  name: "IbBlock",
  props: {
    isActiveClass: { type: String, default: "isActive" },
    hasFocusClass: { type: String, default: "hasFocus" },
    tagName: { type: String, default: "div" },

    index: { type: [Number, Function], required: true },
    value: { required: true },  // can be a function or a value

    // by default "ibHandlePointerUp" event handler will be attached to the element.
    // set to false to prevent if you want to manually attach
    delegateEvents: { type: Boolean, default: true },

    options: { type: Object, default: null },  // other BlockInfo, only works when init
  },
  data() {
    return {
    };
  },
  methods: {
    /**
     * select / active this block, without focusing
     */
    select(multipleSelectType?: "none" | "ctrl" | "shift") {
      return this.ibBlockHandler.select(multipleSelectType);
    },

    /**
     * select / active this block, and move the focus to this BlockContext
     */
    focus(multipleSelectType?: "none" | "ctrl" | "shift") {
      return this.ibBlockHandler.focus(multipleSelectType);
    },

    /**
     * unselect this block, make `isActive` false
     */
    unselect() {
      return this.ibBlockHandler.unselect();
    },

    // ------------------------------- internal -------------------------------

    ibGetOptions() {
      const ans: BlockInfo = {
        ref: this,
        data: () => toValue(this.value),
        index: () => toValue(this.index),
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