import { useSyncExternalStore } from "react";

export type PathArray = (string | number)[];

export function createStore<T>(initialState: T) {
  const listeners = new Set<() => void>();
  let state = initialState;

  const updateState = (path: PathArray, value?: any) => {
    state = produce(state, path, value);
    listeners.forEach(listener => listener());
  };

  return {
    set: updateState,
    delete: (path: PathArray) => updateState(path),
    get: (path: PathArray, defaultValue?: any) => get(state, path, defaultValue),
    get state() {
      return state;
    },
    use: (path: PathArray = []) => {
      return useSyncExternalStore(
        callback => {
          listeners.add(callback);
          return () => listeners.delete(callback);
        },
        () => path.length ? get(state, path) : state
      );
    },
  };
}

/**
 * simplified immer or immutable.js
 *
 * change or delete a property, and all nodes from root to the property will be updated
 *
 * @param obj
 * @param path - example: `['a', 'b', 'c']`
 * @param value - if not pass, will delete the property
 * @return - new object
 */
export function produce(obj: any, path: PathArray, value: any) {
  const isDelete = arguments.length === 2;

  const root = { $: obj };
  const composedPath = ["$", ...path];
  let ptr: any = root;

  for (let i = 0; i < composedPath.length - 1; i++) {
    const key = composedPath[i];

    let nPtr = ptr[key];
    if (!nPtr) {
      nPtr = typeof composedPath[i + 1] === "number" ? [] : {};
    } else {
      nPtr = Array.isArray(nPtr) ? nPtr.slice() : { ...nPtr };
    }

    ptr[key] = nPtr;
    ptr = nPtr;
  }

  const key = path[path.length - 1];
  if (isDelete) delete ptr[key];
  else ptr[key] = value;

  return root.$;
}

/**
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
