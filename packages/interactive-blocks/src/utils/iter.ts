export type Predicate<T> = (value: T, index: number) => boolean;
export type MaybeArray<T> = Array<T | null | undefined> | T | null | undefined;

export function toArray<T>(value: MaybeArray<T>) {
  if (!Array.isArray(value)) value = [value];
  return value.filter(x => x != null) as T[];
}

export function find<T>(iterator: Iterable<T> | null | undefined, predicate: Predicate<T>): T | undefined {
  if (!iterator) return;

  let index = 0;
  for (const item of iterator) {
    if (predicate(item, index)) return item;
    index += 1;
  }
}

export function reduce<T, U>(iterator: Iterable<T> | null | undefined, initial: U, reducer: (agg: U, item: T, index: number) => U): U {
  if (!iterator) return initial;

  let index = 0;
  let agg = initial;
  for (const item of iterator) {
    agg = reducer(agg, item, index);
    index += 1;
  }

  return agg;
}

export function head<T>(iterator: Iterable<T> | null | undefined): T | undefined {
  if (!iterator) return;

  const it = iterator[Symbol.iterator]();
  return it.next().value;
}
