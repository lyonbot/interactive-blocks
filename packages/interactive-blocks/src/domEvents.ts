export interface BlockDOMEventHandlers {
  pointerUp?(ev: Pick<PointerEvent, "eventPhase" | "currentTarget">): void;
  dragStart?(ev: Pick<DragEvent, "stopPropagation" | "dataTransfer" | "clientX" | "clientY">): void;
  dragLeave?(ev: Pick<DragEvent, never>): void;
  dragOver?(ev: Pick<DragEvent, never>): void;
  dragEnd?(ev: Pick<DragEvent, never>): void;
}

export interface SlotDOMEventHandlers {
  pointerUp?: (ev: Pick<PointerEvent, "eventPhase" | "currentTarget">) => void;
  dragOver?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation" | "dataTransfer">) => void;
  dragLeave?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation">) => void;
  drop?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation" | "dataTransfer">) => void;
}

export interface GetDOMEventsOptions {
  /** @default true */
  isWrapper?: boolean;

  /** @default false */
  isDraggable?: boolean;
}

export type FirstParameter<T> = T extends (arg: infer R) => any ? R : never;

type Fn = (...args: any[]) => any;
type FunctionLUT = { [k: string]: Fn };

export type StyledEventLUT<T, S extends EventKeyStyle> = {
  [K in keyof T as ToStyledEventKey<S, K>]: T[K]
};

export type EventKeyStyle = "react" | "vue" | "lowercase" | "camelCase" | undefined | null;

type ToStyledEventKey<S extends EventKeyStyle, KEY> = KEY extends string ? (
  S extends "react" ? `on${Capitalize<KEY>}` :
    S extends "vue" | "lowercase" | "" | undefined | null ? Lowercase<KEY> :
      KEY
) : KEY;

export function getStyledEventHandlersLUT<T, S extends EventKeyStyle>(o: T, style: S): StyledEventLUT<T, S>;
export function getStyledEventHandlersLUT(o: FunctionLUT, style: EventKeyStyle) {
  if (style === "camelCase") return o;

  const answer = {} as FunctionLUT;
  Object.keys(o).forEach(ok => {
    let key = ok;
    if (style === "react") key = `on${key[0]?.toUpperCase()}${key.slice(1)}`;
    else if (style === "lowercase" || style === "vue" || !style) key = key.toLowerCase();

    answer[key] = o[ok]!;
  });
  return answer;
}

// ----------------------------------------------------------------

/**
 * wrap a function, and the wrapped function can be revoked with `wrappedFn.revoke()` -- it will become an empty function
 *
 * with this you can avoid listener memory leaking
 */
export function revokableFn<T>(fn: T | undefined) {
  function delegatedFunction(this: any, ...args: any[]) {
    if (typeof fn === "function") return fn.apply(this, args);
  }

  delegatedFunction.revoke = () => (fn = void 0);
  delegatedFunction.setImpl = (impl: T | undefined) => void (fn = impl);
  return delegatedFunction as RevokableFn<T>;
}

export type RevokableFn<T> = (T & Fn) & {
  revoke(): void;
  setImpl(impl: T | undefined): void;
};
