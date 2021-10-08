export type ValueOrGetter<T> = T | ((owner: any) => T);

export const getValueOf = <T>(value: ValueOrGetter<T>, owner: any): T => {
  if (typeof value === "function") return (value as any)(owner);
  return value;
};
