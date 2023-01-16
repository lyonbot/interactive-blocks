type AnyFn = (...args: any[]) => any;

/**
 * like `SyncHook` but is very simple and lightweight
 */
export function simpleSyncHook<T extends AnyFn = AnyFn>() {
  const filtered = [] as T[];

  const call = ((...args: any[]) => {
    for (let i = 0; i < filtered.length; i++) filtered[i]!(...args);
  }) as T;

  const tap = (fn: T) => {
    if (!fn) return;
    filtered.push(fn as T);
  };

  return {
    tap,
    call,
  };
}

export const emptyFn = () => void 0;

/**
 * wrap a function. in the following calls, if `input` didn't change, `fn` will not execute
 *
 * the wrapped function returns `undefined` if `fn` is not called, or the actual call's return value
 */
export function wrapAsTrigger<T, U>(
  fn: (input: T, lastInput?: T) => U,
  isEqual: (a: T, b: T) => boolean = (a, b) => a == b
): (input: T) => U | void {
  let initialized = false;
  let lastValue: T | undefined;

  return (input: T) => {
    if (initialized && isEqual(lastValue!, input)) return;
    initialized = true;
    lastValue = input;
    fn(input, lastValue);
  };
}
