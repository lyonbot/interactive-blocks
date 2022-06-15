import { useSyncExternalStore } from "react";

/**
 * simplified immer or immutable.js
 *
 * change or delete a property, and all nodes from root to the property will be updated
 *
 * @param {any} obj
 * @param {(string|number)[]} path - example: `['a', 'b', 'c']`
 * @param {any} value - if not pass, will delete the property
 * @return {object} - new object
 */
export function produce(obj, path, value) {
  const isDelete = arguments.length === 2;

  const root = { $: obj };
  const composedPath = ["$", ...path];
  let ptr = root;

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
 * @param {any} obj
 * @param {(string|number)[]} path - example: `['a', 'b', 'c']`
 */
export function get(obj, path, defaultValue) {
  let ptr = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (!ptr[key]) return defaultValue;
    ptr = ptr[key];
  }
  return ptr;
}

/**
 * @template T
 * @param {T} initialState
 * @returns
 */
export function createStore(initialState) {
  const listeners = new Set();
  let state = initialState;

  const produce2 = (path, value) => {
    state = produce(state, path, value);
    listeners.forEach(listener => listener());
  };

  return {
    set: produce2,
    delete: path => produce2(path),
    get: (path, defaultValue) => get(state, path, defaultValue),
    get state() {
      return state;
    },
    use: (path = []) => {
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
