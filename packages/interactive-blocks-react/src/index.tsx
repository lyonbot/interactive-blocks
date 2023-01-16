import * as React from "react";
import { useRef, useContext, useMemo, useEffect } from "react";
import { IBContext, IBSlot, IBBlock, IBContextOptions, IBSlotOptions, IBBlockOptions } from "@lyonbot/interactive-blocks";

// IB = interactive-blocks

const ReactIBContext = React.createContext<IBContext | null>(null);
const ReactIBSlot = React.createContext<IBSlot | null>(null);
const ReactIBBlock = React.createContext<IBBlock | null>(null);

export const useIBContext = () => useContext(ReactIBContext);
export const useIBSlot = () => useContext(ReactIBSlot);
export const useIBBlock = () => useContext(ReactIBBlock);

/**
 * like `useRef()` but the `ref.value` is always the last value that `useLatestRef()` get
 */
export function useLatestRef<T = any>(value: T) {
  const ref = useRef<T>(value);
  ref.current = value;

  return ref;
}

// a wrapper to reset everything
// note: with Vue, this can be much shorter

interface RootProps {
  multipleSelect?: boolean;
  options?: IBContextOptions;
  onMount?(ctx: IBContext): void;
  onUnmount?(ctx: IBContext): void;

  children?: React.ReactNode;
}

export const ReactIBRoot = React.memo((props: RootProps) => {
  const lastProps = useLatestRef(props);
  const blockContext = useMemo(() => new IBContext(props.options || {}), []);

  useEffect(() => {
    lastProps.current?.onMount?.(blockContext);
    return () => {
      lastProps.current?.onUnmount?.(blockContext);
      blockContext.dispose();
    };
  }, [])

  useEffect(() => {
    blockContext.options = {
      multipleSelect: !!props.multipleSelect,
      ...props.options,
    }
  }, [props.options, props.multipleSelect, blockContext])

  return (
    <ReactIBContext.Provider value={blockContext}>
      <ReactIBBlock.Provider value={null}>
        <ReactIBSlot.Provider value={null}>
          {props.children}
        </ReactIBSlot.Provider>
      </ReactIBBlock.Provider>
    </ReactIBContext.Provider>
  );
})

type ExtendedProps<T> = {
  onStatusChange?(target: T): void
}

/**
 * For custom slot component
 */
export function useSlotHandler(_opt: IBSlotOptions & ExtendedProps<IBSlot>) {
  const blockContext = useIBContext()
  const ownerBlock = useIBBlock(); // could be null if this slot is directly under Root
  const options = useLatestRef(_opt)

  if (!blockContext) {
    throw new Error("No interactive-block BlockContext");
  }

  const slot = useMemo(() => new IBSlot(ownerBlock || blockContext, options.current), []);
  slot.options = options.current

  // when component unmount, dispose the slotHandler
  useEffect(() => {
    // -----
    // add more init code here ...
    // -----

    slot.on('statusChange', () => options.current.onStatusChange?.(slot))

    return function disposer() {
      slot.dispose();
    };
  }, [slot]);

  const returns = useMemo(() => {
    const domEvents = { onPointerDown: slot.handlePointerDown as unknown as React.PointerEventHandler }
    const domProps = { tabIndex: -1, ...domEvents }

    return ({
      blockContext,
      ownerBlock,
      slot,
      domEvents,
      domProps,
      SlotWrapper: (props: React.PropsWithChildren) => (
        <ReactIBSlot.Provider value={slot}>{props.children}</ReactIBSlot.Provider>
      ),
    });
  }, []);

  return returns;
}

/**
 * For custom slot component
 */
export function useBlockHandler(_opt: IBBlockOptions & ExtendedProps<IBBlock>) {
  const blockContext = useIBContext()
  const ownerSlot = useIBSlot(); // could be null if this block is directly under Root
  const options = useLatestRef(_opt)

  if (!blockContext) {
    throw new Error("No interactive-block BlockContext");
  }

  const block = useMemo(() => new IBBlock(ownerSlot || blockContext, options.current), []);
  block.options = options.current

  // when component unmount, dispose the slotHandler
  useEffect(() => {
    // -----
    // add more init code here ...
    // -----

    block.on('statusChange', () => options.current.onStatusChange?.(block))

    return function disposer() {
      block.dispose();
    };
  }, [block]);

  const returns = useMemo(() => {
    const domEvents = { onPointerDown: block.handlePointerDown as unknown as React.PointerEventHandler }
    const domProps = { tabIndex: -1, ...domEvents }

    return ({
      blockContext,
      ownerSlot,
      slot: block,
      domEvents,
      domProps,
      BlockWrapper: (props: React.PropsWithChildren) => (
        <ReactIBBlock.Provider value={block}>{props.children}</ReactIBBlock.Provider>
      ),
    });
  }, []);

  return returns;
}
