import * as React from "react";
import { useRef, useContext, useMemo, useEffect, useImperativeHandle } from "react";
import { IBContext, IBSlot, IBBlock, IBContextOptions, IBElement, IBSlotOptions, IBBlockOptions } from "@lyonbot/interactive-blocks";

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

export interface IBContextWrapperProps extends IBContextOptions {
  onSetup?(ctx: IBContext): void;
  onDispose?(ctx: IBContext): void;
}

export const IBContextWrapper = React.forwardRef<IBContext, React.PropsWithChildren<IBContextWrapperProps>>((props, ref) => {
  const lastProps = useLatestRef(props);
  const options: IBContextOptions = props;
  const blockContext = useMemo(() => new IBContext(options), []);
  blockContext.options = options;

  useEffect(() => {
    lastProps.current?.onSetup?.(blockContext);
    return () => {
      lastProps.current?.onDispose?.(blockContext);
      blockContext.dispose();
    };
  }, []);

  useImperativeHandle(ref, () => blockContext, []);

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

type ExtendedElementOptions<T> = {
  /**
   * The ref to current IBSlot / IBBlock instance.
   *
   * With the instance you can add more listeners, and call methods of it.
   *
   * @see domRef - if you want to get the DOM Element
   */
  ref?: React.MutableRefObject<T>;

  /**
   * The wrapper DOM element. Basically is a `<div>` element
   *
   * @example
   *     const divElement = React.useRef()
   *     useEffect(() => {
   *       console.log('divElement is ', divElement.current)
   *     }, [])
   *
   *     return <IBBlockWrapper domRef={divElement} {...otherProps}>...</IBBlockWrapper>
   */
  domRef?: React.MutableRefObject<any>;

  /**
   * The tag name of the DOM element.
   *
   * @default "div"
   */
  tagName?: React.ComponentType<any> | keyof JSX.IntrinsicElements;

  /**
   * Fires when `hasFocus` or `isSelected` changed.
   *
   * You shall update the style (eg. update className) when this fires.
   */
  onStatusChange?(element: T): void;

  onSetup?(element: T): void;
  onDispose?(element: T): void;
};
const keysOfExtendedOptions: Record<keyof ExtendedElementOptions<any>, any> = {
  ref: true,
  domRef: true,
  tagName: true,
  onStatusChange: true,
  onSetup: true,
  onDispose: true,
};

function elementFactory<SELF extends IBElement>(factoryOpts: {
  ctor: { new(parent: any, options: any): SELF };
  reactContext: React.Context<SELF | null>;
  displayName: string;
  optionsKeys: Record<keyof SELF["options"], any>;
  useParent: (() => SELF["parent"]);
}) {
  type ElementOptions = SELF["options"];

  /**
   * values extracted from props that not belongs to HTMLElement
   */
  type BaseProps = ElementOptions & ExtendedElementOptions<SELF>;

  /**
   * Factory-returned Components accept optional `tagName`
   * if `tagName` is specified, provide the correct TypeScript Props type
   */
  type ElementWrapper = (props: BaseProps & Omit<JSX.IntrinsicElements["div"], "ref">) => React.ReactElement | null;

  /**
   * The Implement
   */
  const ReactContextProvider = factoryOpts.reactContext.Provider;

  const wrapper = React.forwardRef<SELF, BaseProps & { [k: string]: any }>((_props, forwardedRef) => {
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

    const element = useMemo(() => new factoryOpts.ctor(parent || blockContext, latestProps.current), []);
    element.options = options; // sync "options" in each render

    useImperativeHandle(forwardedRef, () => element, []);

    const domRef = useRef<HTMLElement>(); // in case that user didn't provide `domRef`
    const getDOM = React.useCallback(() => domRef.current, []);
    useImperativeHandle(options.domRef, () => domRef.current);  // no dep list, make each render update it
    useEffect(() => { element.domElement = getDOM(); });  // always make `domElement` up-to-date on each rendering

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

    domProps.tabIndex ??= -1;

    const Tag = options.tagName || "div";
    return <ReactContextProvider value={element}>
      <Tag {...domProps} ref={domRef}>{_props.children}</Tag>
    </ReactContextProvider>;
  });
  wrapper.displayName = factoryOpts.displayName;

  return wrapper as unknown as ElementWrapper;
}

export const IBSlotWrapper = elementFactory({
  ctor: IBSlot,
  reactContext: ReactIBSlot,
  useParent: useParentBlock,
  displayName: "IBSlot",
  optionsKeys: {
    handleInsert: true,
    handleMove: true,
    handleRemove: true,
    handleTransferInto: true,
    serializer: true,
  },
});

export const IBBlockWrapper = elementFactory({
  ctor: IBBlock,
  reactContext: ReactIBBlock,
  useParent: useParentSlot,
  displayName: "IBBlock",
  optionsKeys: {
    data: true,
    index: true,
  },
});

export type IBSlotWrapperProps = IBSlotOptions & ExtendedElementOptions<IBSlot>;
export type IBBlockWrapperProps = IBBlockOptions & ExtendedElementOptions<IBBlock>;
