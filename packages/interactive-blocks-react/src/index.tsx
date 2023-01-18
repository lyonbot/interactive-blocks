import * as React from "react";
import { useRef, useContext, useMemo, useEffect, useImperativeHandle } from "react";
import { IBContext, IBSlot, IBBlock, IBContextOptions, IBElement } from "@lyonbot/interactive-blocks";

// IB = interactive-blocks

const ReactIBContext = React.createContext<IBContext | null>(null);
const ReactIBSlot = React.createContext<IBSlot | null>(null);
const ReactIBBlock = React.createContext<IBBlock | null>(null);

export const useIBContext = () => useContext(ReactIBContext);
export const useParentSlot = () => useContext(ReactIBSlot);
export const useParentBlock = () => useContext(ReactIBBlock);

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
  /** default is true */
  multipleSelect?: boolean;

  /** other context options */
  options?: IBContextOptions;
  onMount?(ctx: IBContext): void;
  onUnmount?(ctx: IBContext): void;
}

export const ReactIBRoot = React.memo((props: React.PropsWithChildren<RootProps>) => {
  const lastProps = useLatestRef(props);
  const blockContext = useMemo(() => new IBContext(props.options || {}), []);

  useEffect(() => {
    lastProps.current?.onMount?.(blockContext);
    return () => {
      lastProps.current?.onUnmount?.(blockContext);
      blockContext.dispose();
    };
  }, []);

  useEffect(() => {
    blockContext.options = {
      multipleSelect: !!(props.multipleSelect ?? true),
      ...props.options,
    };
  }, [props.options, props.multipleSelect, blockContext]);

  return (
    <ReactIBContext.Provider value={blockContext}>
      <ReactIBBlock.Provider value={null}>
        <ReactIBSlot.Provider value={null}>
          {props.children}
        </ReactIBSlot.Provider>
      </ReactIBBlock.Provider>
    </ReactIBContext.Provider>
  );
});

type ExtendedOptions<T, RefType> = {
  ref?: React.MutableRefObject<RefType>;
  domRef?: React.MutableRefObject<any>;
  tagName?: React.ComponentType<any> | keyof JSX.IntrinsicElements;
  onStatusChange?(element: T): void;
  onSetup?(element: T): void;
  onDispose?(element: T): void;
};
const keysOfExtendedOptions: Record<keyof ExtendedOptions<any, any>, any> = {
  ref: true,
  domRef: true,
  tagName: true,
  onStatusChange: true,
  onSetup: true,
  onDispose: true,
};

function elementFactory<SELF extends IBElement, ExposedHandle>(factoryOpts: {
  clazz: { new(parent: any, options: any): SELF };
  reactContext: React.Context<SELF | null>;
  displayName: string;
  optionsKeys: Record<keyof SELF["options"], any>;
  useParent: (() => SELF["parent"]);
  setup(element: SELF, getDOM: () => (HTMLElement | undefined)): {
    expose: ExposedHandle;
    domProps: React.HTMLAttributes<HTMLElement>;
    domEvents: Record<string, (...args: any[]) => any>;
  };
}) {
  type ElementOptions = SELF["options"];

  /**
   * values extracted from props that not belongs to HTMLElement
   */
  type BaseProps = ElementOptions & ExtendedOptions<SELF, ExposedHandle>;

  /**
   * Factory-returned Components accept optional `tagName`
   * if `tagName` is specified, provide the correct TypeScript Props type
   */
  type ElementWrapper = (props: BaseProps & Omit<JSX.IntrinsicElements["div"], "ref">) => React.ReactElement | null;

  /**
   * The Implement
   */
  const ReactContextProvider = factoryOpts.reactContext.Provider;

  const wrapper = React.forwardRef<ExposedHandle, BaseProps & { [k: string]: any }>((_props, forwardedRef) => {
    const blockContext = useIBContext();
    const parent = factoryOpts.useParent(); // could be null if this slot is directly under Root
    const latestProps = useLatestRef(_props);

    if (!blockContext) throw new Error("No interactive-block BlockContext");

    // ----------------------------------------------------------------
    // extract "options" and "domProps" from incoming raw props

    const options = {} as BaseProps;
    const domProps = {} as Record<string, any>;

    Object.keys(_props).forEach(key => {
      if (key === "children") return;

      const val = _props[key];
      const writeTo = (key in factoryOpts.optionsKeys || key in keysOfExtendedOptions) ? options : domProps;
      writeTo[key] = val;
    });

    // ----------------------------------------------------------------
    // setup IBElement (aka. IBSlot or IBBlock)

    const fallbackDOMRef = useRef<HTMLElement>(); // in case that user didn't provide `domRef`
    const domRef = options.domRef || fallbackDOMRef;
    const getDOM = React.useCallback(() => (latestProps.current.domRef as BaseProps["domRef"] || fallbackDOMRef).current, []);

    const element = useMemo(() => new factoryOpts.clazz(parent || blockContext, latestProps.current), []);
    element.options = options; // sync "options" in each render

    const setup = useMemo(() => factoryOpts.setup(element, getDOM), []);
    useImperativeHandle(forwardedRef, () => setup.expose, []);

    // when component unmount, dispose the slotHandler
    useEffect(() => {
      element.on("statusChange", () => latestProps.current.onStatusChange?.(element));
      element.on("dispose", () => latestProps.current.onDispose?.(element));
      latestProps.current.onSetup?.(element);

      return function disposer() {
        element.dispose();
      };
    }, []);

    // ----------------------------------------------------------------
    // DOM Element

    Object.keys(setup.domEvents).forEach(on => {
      const handler = setup.domEvents[on]!;
      const userHandler = domProps[on];

      if (!userHandler) return handler;
      return (...args: any[]) => {
        handler(...args);
        return userHandler(...args);
      };
    });

    const Tag = options.tagName || "div";
    return <ReactContextProvider value={element}>
      <Tag {...setup.domProps} {...domProps} ref={domRef}>{_props.children}</Tag>
    </ReactContextProvider>;
  });
  wrapper.displayName = factoryOpts.displayName;

  return wrapper as unknown as ElementWrapper & {
    [basePropsType]: BaseProps;  // not actual exists. only for TypeScript
    [handleType]: ExposedHandle; // not actual exists. only for TypeScript
  };
}

export const IBSlotWrapper = elementFactory({
  clazz: IBSlot,
  reactContext: ReactIBSlot,
  displayName: "IBSlot",
  optionsKeys: {
    handleInsert: true,
    handleMove: true,
    handleRemove: true,
    handleTransferInto: true,
    serializer: true,
  },
  useParent: useParentBlock,
  setup(slot, getDOM) {
    const blockContext = slot.ctx;
    const ownerBlock = slot.parent;

    const domEvents = {
      onPointerDown: slot.handlePointerDown as unknown as React.PointerEventHandler,
    };
    const domProps = { tabIndex: -1, ...domEvents };

    return {
      expose: {
        blockContext,
        ownerBlock,
        slot,
        domEvents,
        domProps,
        getDOM,
        get $el() { return getDOM(); }, // Vue style API
      },
      domProps,
      domEvents,
    };
  },
});

export const IBBlockWrapper = elementFactory({
  clazz: IBBlock,
  reactContext: ReactIBBlock,
  displayName: "IBBlock",
  optionsKeys: {
    data: true,
    index: true,
  },
  useParent: useParentSlot,
  setup(block, getDOM) {
    const blockContext = block.ctx;
    const ownerSlot = block.parent;

    const domEvents = {
      onPointerDown: block.handlePointerDown as unknown as React.PointerEventHandler,
    };
    const domProps = { tabIndex: -1, ...domEvents };

    return {
      expose: {
        blockContext,
        ownerSlot,
        block,
        domEvents,
        domProps,
        getDOM,
        get $el() { return getDOM(); }, // Vue style API
      },
      domProps,
      domEvents,
    };
  },
});

const basePropsType = Symbol();
const handleType = Symbol();

export type IBSlotWrapperProps = typeof IBSlotWrapper[typeof basePropsType];
export type IBSlotWrapperHandle = typeof IBSlotWrapper[typeof handleType];

export type IBBlockWrapperProps = typeof IBBlockWrapper[typeof basePropsType];
export type IBBlockWrapperHandle = typeof IBBlockWrapper[typeof handleType];
