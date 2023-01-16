export type ValueOrGetter<T, Owner = any> = T | ((owner: Owner) => T);

export const getValueOf = <T>(value: ValueOrGetter<T>, owner: any): T => {
  if (typeof value === "function") return (value as any)(owner);
  return value;
};
