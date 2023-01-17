export type ValueOrGetter<T, Owner = any> = T | ((owner: Owner) => T);

export const getValueOf = <T, U>(value: ValueOrGetter<T, U>, owner: U): T => {
  if (typeof value === "function") return (value as any)(owner);
  return value;
};
