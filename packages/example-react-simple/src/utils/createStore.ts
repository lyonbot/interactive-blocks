import { Immutable, produce } from "immer";
import { useCallback, useRef, useSyncExternalStore } from "react";

export type PathArray = (string | number)[];

/**
 * crate a store based on Immer
 */
export function createStore<T>(initialState: T) {
  const listeners = new Set<() => void>();
  let state = initialState;

  return {
    get: (path: PathArray, defaultValue?: any) => get(state, path, defaultValue),
    get state() { return state; },
    use: <T2>(path: PathArray = []) => {
      const value = useSyncExternalStore(
        callback => {
          listeners.add(callback);
          return () => listeners.delete(callback);
        },
        () => path.length ? get(state, path) : state
      ) as T2;

      const lastPath = useRef(path)
      lastPath.current = path;

      const updater = useCallback((recipe: (value: T2, store: T) => void) => {
        state = produce((s: T) => { recipe(get(s, lastPath.current), s) })(state as Immutable<T>)
        for (const fn of listeners) fn()
      }, [])

      return [value, updater] as const
    },
  };
}

/**
 * equals to lodash's `get()`, except it returns `obj` itself when `path` is empty
 * 
 * @param obj
 * @param path - example: `['a', 'b', 'c']`
 */
export function get(obj: any, path: PathArray, defaultValue?: any) {
  let ptr = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (!ptr[key]) return defaultValue;
    ptr = ptr[key];
  }
  return ptr;
}
