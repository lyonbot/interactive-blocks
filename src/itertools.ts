export type Predicate<T> = (value: T, index: number) => boolean;

export function find<T>(iterator: Iterable<T> | null | undefined, predicate: Predicate<T>): T | undefined {
  if (!iterator) return;

  let index = 0;
  for (const item of iterator) {
    if (predicate(item, index)) return item;
    index += 1;
  }
}

export function head<T>(iterator: Iterable<T> | null | undefined): T | undefined {
  if (!iterator) return;

  const it = iterator[Symbol.iterator]();
  return it.next().value;
}
