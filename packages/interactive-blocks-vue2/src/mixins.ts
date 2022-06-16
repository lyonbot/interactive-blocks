/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  BlockContext,
  BlockContextOptions,
  BlockHandler,
  BlockInfo,
  SlotHandler,
  SlotInfo
} from "@lyonbot/interactive-blocks";

import Vue from "vue";

export const provideKey_blockContext = "interactive-block-vue2:blockContext";
export const provideKey_ownerBlock = "interactive-block-vue2:ownerBlock";
export const provideKey_ownerSlot = "interactive-block-vue2:ownerSlot";

export const IBRootMixin = Vue.extend<{
  ibBlockContext: BlockContext;
  ibHasFocus: boolean;
}, {
  ibGetOptions(): BlockContextOptions;
  ibOnMount(blockContext: BlockContext): void;
  ibOnUnmount(blockContext: BlockContext): void;
}, {}>({
      provide() {
        return {
          [provideKey_blockContext]: () => this.ibBlockContext,
          [provideKey_ownerBlock]: null,
          [provideKey_ownerSlot]: null,
        };
      },
      methods: {
        ibGetOptions() {
          return {};
        },
        ibOnMount(blockContext: BlockContext) {
          //
        },
        ibOnUnmount(blockContext: BlockContext) {
          //
        },
      },
      created() {
        const blockContext = new BlockContext(this.ibGetOptions());
        this.ibBlockContext = blockContext;

        blockContext.on("focus", () => { this.ibHasFocus = true; });
        blockContext.on("blur", () => { this.ibHasFocus = false; });
        this.ibOnMount(blockContext);
      },
      beforeDestroy() {
        this.ibOnUnmount(this.ibBlockContext);
        this.ibBlockContext.dispose();
        this.ibBlockContext = null as any;
      },
    });

// ----------------------------------------------------------------

export const IBBlockMixin = Vue.extend<{
  [provideKey_ownerSlot]?: () => SlotHandler | null;
  [provideKey_blockContext]: () => BlockContext;
  ibBlockHandler: BlockHandler;
  ibIsActive: boolean;
  ibHasFocus: boolean;
}, {
  ibGetOptions(): BlockInfo;
  ibHandlePointerUp(ev: any): void;
}, {
  ibBlockContext: BlockContext;
}>({
      inject: [provideKey_blockContext, provideKey_ownerSlot],
      provide() {
        return {
          [provideKey_ownerBlock]: () => this.ibBlockHandler,
        };
      },
      // @ts-ignore
      data() {
        return {
          ibIsActive: false,
          ibHasFocus: false,
        };
      },
      methods: {
        ibGetOptions(): BlockInfo {
          throw new Error("You must override ibGetOptions()");
        },
        ibHandlePointerUp(ev: any) {
          this.ibBlockHandler.handlePointerUp();
          // slotHandler.handlePointerUpCapture();  // or if in capture phase

          // make copy / cut / paste keyboard shortcuts work
          // a hidden input will be focused
          if (isTargetActiveElement(ev.currentTarget)) this.ibBlockContext.focus();
        },
      },
      created() {
        const blockContext = this.ibBlockContext;
        const parent = (this[provideKey_ownerSlot]?.()) || blockContext;

        const oldOptions = this.ibGetOptions();
        const newOptions: BlockInfo = {
          ...oldOptions,
          onStatusChange: (...args) => {
            if (blockHandler.isActive !== this.ibIsActive) this.ibIsActive = blockHandler.isActive;
            if (blockHandler.hasFocus !== this.ibHasFocus) this.ibHasFocus = blockHandler.hasFocus;

            this.$emit("ib-status-change", ...args);
            oldOptions.onStatusChange?.(...args);
          },
        };

        const blockHandler = parent.createBlock(newOptions);
        this.ibBlockHandler = blockHandler;
      },
      beforeDestroy() {
        this.ibBlockHandler.dispose();
        this.ibBlockHandler = null as any;
      },
      computed: {
        ibBlockContext() {
          return this[provideKey_blockContext]();
        },
      },
    });

// ----------------------------------------------------------------


export const IBSlotMixin = Vue.extend<{
  [provideKey_ownerBlock]?: () => BlockHandler | null;
  [provideKey_blockContext]: () => BlockContext;
  ibSlotHandler: SlotHandler;
  ibIsActive: boolean;
  ibHasFocus: boolean;
}, {
  ibGetOptions(): SlotInfo;
  ibHandlePointerUp(ev: any): void;
}, {
  ibBlockContext: BlockContext;
}>({
      inject: [provideKey_blockContext, provideKey_ownerBlock],
      provide() {
        return {
          [provideKey_ownerSlot]: () => this.ibSlotHandler,
        };
      },
      // @ts-ignore
      data() {
        return {
          ibIsActive: false,
          ibHasFocus: false,
        };
      },
      methods: {
        ibGetOptions(): SlotInfo {
          return {};
        },
        ibHandlePointerUp(ev: any) {
          this.ibSlotHandler.handlePointerUp();
          // slotHandler.handlePointerUpCapture();  // or if in capture phase

          // make copy / cut / paste keyboard shortcuts work
          // a hidden input will be focused
          if (isTargetActiveElement(ev.currentTarget)) this.ibBlockContext.focus();
        },
      },
      created() {
        const blockContext = this.ibBlockContext;
        const parent = (this[provideKey_ownerBlock]?.()) || blockContext;

        const oldOptions = this.ibGetOptions();
        const newOptions: SlotInfo = {
          ...oldOptions,
          onStatusChange: (...args) => {
            if (blockHandler.isActive !== this.ibIsActive) this.ibIsActive = blockHandler.isActive;
            if (blockHandler.hasFocus !== this.ibHasFocus) this.ibHasFocus = blockHandler.hasFocus;

            this.$emit("ib-status-change", ...args);
            oldOptions.onStatusChange?.(...args);
          },
        };

        const blockHandler = parent.createSlot(newOptions);
        this.ibSlotHandler = blockHandler;
      },
      beforeDestroy() {
        this.ibSlotHandler.dispose();
        this.ibSlotHandler = null as any;
      },
      computed: {
        ibBlockContext() {
          return this[provideKey_blockContext]();
        },
      },
    });


// ----------------------------------------------------------------

function isTargetActiveElement(target: any) {
  if (!target || typeof target.getRootNode !== "function") return false;

  const root = target.getRootNode();  // do not directly use "document"
  if (!root) return false;

  return root.activeElement === target;
}
