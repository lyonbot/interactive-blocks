/* eslint-disable @typescript-eslint/ban-ts-comment */

import { BlockContext, BlockContextOptions } from "@lyonbot/interactive-blocks";
import { IBRootMixin } from "../mixins";
import { getPropsUtil } from "./util";


const props = getPropsUtil<BlockContextOptions>({
  brand: { type: String, default: "" },
  deactivateHandlersWhenBlur: { type: Boolean, default: true },
  navigateWithArrowKeys: { type: Boolean, default: true },
  handleDeleteKey: { type: Boolean, default: true },
  multipleSelect: { type: Boolean, default: true },
});

export const IbRoot = IBRootMixin.extend({
  name: "IbRoot",
  props: {
    hasFocusClass: { type: String, default: "hasFocus" },
    tagName: { type: String, default: "div" },

    ...props.propsDefines,
    options: { type: Object, default: null },  // other BlockContextOptions, only works when init
  },
  data() {
    return {
    };
  },
  methods: {
    focus() {
      return this.ibBlockContext.focus();
    },

    /**
     * dump all active blocks' data, then you can transfer it via file / clipboard etc,
     * and use it with {@link pasteWithData}
     *
     * this will NOT delete the selected blocks. if you want to, call {@link deleteActiveBlocks}
     *
     * @see {@link pasteWithData}
     * @returns `undefined` if cannot copy. otherwise returns text
     */
    dumpSelectedData() {
      return this.ibBlockContext.dumpSelectedData();
    },

    /**
     * do a "pasting" action with the data exported by {@link dumpSelectedData}
     *
     * @param data
     * @param targetIndex - the insert point. if not specified, will be before the active block, of the end of current active slot.
     * @see {@link dumpSelectedData}
     */
    pasteWithData(data: any, targetIndex?: number) {
      return this.ibBlockContext.pasteWithData(data, targetIndex);
    },


    /**
     * Make a Cut Action and send to activeSlot.
     *
     * `cut` event will be emitted on the slot and this context.
     *
     * clipboard not affected. Call `copy` before this, if needed.
     *
     * @return `true` if action is handled and not `preventDefault`-ed
     */
    deleteActiveBlocks() {
      return this.ibBlockContext.deleteActiveBlocks();
    },

    // ------------------------------- internal -------------------------------

    ibGetOptions() {
      return props.mix(this, this.options);
    },

    ibOnMount(blockContext: BlockContext) {
      blockContext.on("focus", () => { this.$emit("focus"); });
      blockContext.on("blur", () => { this.$emit("blur"); });
      blockContext.on("activeElementChanged", () => this.$emit("activeElementChanged"));

      // @ts-ignore
      props.watchAll(this, (k, v) => (blockContext.options[k] = v));

      this.$emit("mount", blockContext);
    },

    ibOnUnmount(blockContext: BlockContext) {
      this.$emit("unmount", blockContext);
    },
  },
  render(h) {
    return h(
      this.tagName,
      {
        class: {
          [this.hasFocusClass]: this.ibHasFocus,
        },
        on: this.$listeners,
        attrs: this.$attrs,
      },
      this.$slots.default
    );
  },
});