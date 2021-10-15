/**
 * make a throttled function that actually executes with the last given arguments.
 */
export function throttle<T extends (...args: any) => void>(fn: T, wait: number) {
  let timerId: any;
  let lastArgs: any[] | undefined;

  function cancel(invoke = false) {
    if (!timerId) return;

    if (invoke && lastArgs) fn(...lastArgs);
    clearTimeout(timerId);

    timerId = null;
    lastArgs = undefined;
  }

  const throttled = function throttled(...args: any[]) {
    lastArgs = args;

    if (!timerId) {
      timerId = setTimeout(() => cancel(true), wait);
    }
  } as unknown as T & { cancel(): void; flush(): void };

  throttled.cancel = () => cancel(false);
  throttled.flush = () => cancel(true);

  return throttled;
}

/**
 * extract and remove items from the array safely.
 *
 * this will mutate `arr` the input array.
 *
 * @returns removed items in `indexes` order
 */
export function removeItems<T>(arr: T[], indexes: number[]): T[] {
  const ans = indexes.map(i => arr[i]!).filter(x => x !== undefined);
  [...indexes].sort((a, b) => b - a).forEach(i => arr.splice(i, 1));
  return ans;
}

/**
 * move items inside an array safely.
 *
 * this will mutate `arr` the input array.
 */
export function moveItemsInArray(arr: any[], fromIndexes: number[], toIndex: number) {
  const items = removeItems(arr, fromIndexes);
  arr.splice(toIndex, 0, ...items);
}

/**
 * move items between two arrays safely.
 *
 * this will mutate `fromArr` and `toArr`
 *
 * @param fromArr
 * @param fromIndexes
 * @param toArr
 * @param toIndex
 */
export function moveItemsBetweenArrays(fromArr: any[], fromIndexes: number[], toArr: any[], toIndex: number) {
  const items = removeItems(fromArr, fromIndexes);
  toArr.splice(toIndex, 0, ...items);
}


// eslint-disable-next-line @typescript-eslint/ban-types
type FunctionLUT = Record<string, Function>;

export type StyledFunctionLUTs<T extends FunctionLUT> = {
  "react": { [k in keyof T as ToReactEventKey<k>]: T[k] };
  "lowercase": { [k in keyof T as ToLowerCaseEventKey<k>]: T[k] };
  "camelCase": T;
};

export type EventKeyStyle = "react" | "lowercase" | "camelCase";

type ToReactEventKey<T> = T extends string ? `on${Capitalize<T>}` : T;
type ToLowerCaseEventKey<T> = T extends string ? Lowercase<T> : T;

export function getStyledEventHandlersLUT<T extends FunctionLUT, S extends EventKeyStyle>(o: T, style: S): StyledFunctionLUTs<T>[S];
export function getStyledEventHandlersLUT(o: FunctionLUT, style: EventKeyStyle) {
  if (style === "camelCase") return o;

  const answer = {} as FunctionLUT;
  Object.keys(o).forEach(ok => {
    let key = ok;
    if (style === "react") key = `on${key[0]?.toUpperCase()}${key.substr(1)}`;
    if (style === "lowercase") key = key.toLowerCase();

    answer[key] = o[ok]!;
  });
  return answer;
}
