import { Predicate } from "./iter";

export type MaybeArray<T> = Array<T | null | undefined> | T | null | undefined;

export function toArray<T>(value: MaybeArray<T>) {
  if (!Array.isArray(value)) value = [value];
  return value.filter(x => x != null) as T[];
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

export function findLast<T>(arr: T[], predict: Predicate<T>): T | undefined {
  for (let i = arr.length - 1; i>=0;i--) {
    const element = arr[i]!;
    if (predict(element, i)) return element;
  }
}
