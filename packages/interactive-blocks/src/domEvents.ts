export interface BlockDOMEventHandlers {
  pointerUp(ev: Pick<PointerEvent, "eventPhase" | "currentTarget">): void;
  dragStart?(ev: Pick<DragEvent, "stopPropagation" | "dataTransfer" | "clientX" | "clientY">): void;
  dragLeave?(ev: Pick<DragEvent, never>): void;
  dragOver?(ev: Pick<DragEvent, never>): void;
  dragEnd?(ev: Pick<DragEvent, never>): void;
}

export interface SlotDOMEventHandlers {
  pointerUp: (ev: Pick<PointerEvent, "eventPhase" | "currentTarget">) => void;
  dragOver?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation" | "dataTransfer">) => void;
  dragLeave?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation">) => void;
  drop?: (ev: Pick<DragEvent, "preventDefault" | "stopPropagation" | "dataTransfer">) => void;
}

export interface GetDOMEventsOptions {
  draggable?: boolean;
}

export type FirstParameter<T> = T extends (arg: infer R) => any ? R : never;

// eslint-disable-next-line @typescript-eslint/ban-types
type FunctionLUT = { [k: string]: (...args: any[]) => any };

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
