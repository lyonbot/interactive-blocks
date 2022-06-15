import {
  BlockContext,
  BlockContextOptions,
  BlockHandler,
  BlockInfo,
  SlotHandler,
  SlotInfo
} from "@lyonbot/interactive-blocks";

import * as React from "react";
import { useRef, useContext, useMemo, useEffect } from "react";

// IB = interactive-blocks

export const ReactIBRootContext = React.createContext<BlockContext | null>(null);
export const ReactIBSlotContext = React.createContext<SlotHandler | null>(null);
export const ReactIBBlockContext = React.createContext<BlockHandler | null>(null);

// a wrapper to reset everything
// note: with Vue, this can be much shorter

interface RootProps {
  options?: BlockContextOptions;
  onMount?(ctx: BlockContext): void;
  onUnmount?(ctx: BlockContext): void;

  children?: React.ReactNode;
}

export const ReactInteractiveBlocksRoot = React.memo(
  (props: RootProps) => {
    const lastProps = useRef<RootProps | null>(props);
    const blockContext = useMemo(() => new BlockContext(props.options), []);

    lastProps.current = props;
    useEffect(() => {
      lastProps.current?.onMount?.(blockContext);
      return () => {
        lastProps.current?.onUnmount?.(blockContext);
        blockContext.dispose();
      };
    }, []);

    return (
      <ReactIBRootContext.Provider value={blockContext}>
        <ReactIBBlockContext.Provider value={null}>
          <ReactIBSlotContext.Provider value={null}>
            {props.children}
          </ReactIBSlotContext.Provider>
        </ReactIBBlockContext.Provider>
      </ReactIBRootContext.Provider>
    );
  }
);

export const useIBBlockContext = () => useContext(ReactIBRootContext);
export const useOwnerSlot = () => useContext(ReactIBSlotContext);
export const useOwnerBlock = () => useContext(ReactIBBlockContext);

/**
 * For custom slot component
 */
export function useNewSlotHandler(getSlotInfo: () => SlotInfo) {
  const blockContext = useContext(ReactIBRootContext);
  const ownerBlock = useContext(ReactIBBlockContext); // could be null if this slot is directly under Root

  if (!blockContext) {
    throw new Error("No interactive-block BlockContext");
  }

  const slotHandler = useMemo(() => {
    const parent = ownerBlock || blockContext;
    const slotInfo = getSlotInfo();

    return parent.createSlot(slotInfo);
  }, []);

  // when component unmount, dispose the slotHandler
  useEffect(() => {
    // -----
    // add more init code here ...
    // -----

    return function disposer() {
      slotHandler.dispose();
    };
  }, [slotHandler]);

  const returns = useMemo(
    () => ({
      blockContext,
      ownerBlock,
      slotHandler,
      handleSlotPointerUp(ev: any) {
        slotHandler.handlePointerUp();
        // slotHandler.handlePointerUpCapture();  // or if in capture phase

        // make copy / cut / paste keyboard shortcuts work
        // a hidden input will be focused
        if (isTargetActiveElement(ev.currentTarget)) blockContext.focus();
      },
      SlotWrapper: (props: React.PropsWithChildren) => (
        <ReactIBSlotContext.Provider value={slotHandler}>
          {props.children}
        </ReactIBSlotContext.Provider>
      ),
    }),
    []
  );
  return returns;
}

// for block component

export function useNewBlockHandler(getBlockInfo: () => BlockInfo) {
  const blockContext = useContext(ReactIBRootContext);
  const ownerSlot = useContext(ReactIBSlotContext); // could be null if this block is directly under Root

  if (!blockContext) {
    throw new Error("No interactive-block BlockContext");
  }

  const blockHandler = useMemo(() => {
    const parent = ownerSlot || blockContext;
    const blockInfo = getBlockInfo();

    return parent.createBlock(blockInfo);
  }, []);

  // when component unmount, dispose the blockHandler
  useEffect(() => {
    // -----
    // add more init code here ...
    // -----

    return function disposer() {
      blockHandler.dispose();
    };
  }, [blockHandler]);

  const returns = useMemo(
    () => ({
      blockContext,
      ownerSlot,
      blockHandler,
      handleBlockPointerUp(ev: any) {
        blockHandler.handlePointerUp();
        // slotHandler.handlePointerUpCapture();  // or if in capture phase

        // make copy / cut / paste keyboard shortcuts work
        // a hidden input will be focused
        if (isTargetActiveElement(ev.currentTarget)) blockContext.focus();
      },
      BlockWrapper: (props: React.PropsWithChildren) => (
        <ReactIBBlockContext.Provider value={blockHandler}>
          {props.children}
        </ReactIBBlockContext.Provider>
      ),
    }),
    []
  );

  return returns;
}

function isTargetActiveElement(target: any) {
  if (!target || typeof target.getRootNode !== "function") return false;

  const root = target.getRootNode();  // do not directly use "document"
  if (!root) return false;

  return root.activeElement === target;
}

// utils

export function useLatestRef<T = any>(value: T) {
  const ref = useRef<T | null>(null);
  ref.current = value;

  return ref;
}