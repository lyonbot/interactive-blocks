import Vue from "vue";

interface PropsUtil<T> {
  propsDefines: Record<string, any>;
  mix(instance: any, extra: T | null | undefined): T;
  watchAll(instance: Vue, onChange: (key: string, value: any) => void): void;
}

export function getPropsUtil<T extends Record<string, any>>(propsDefines: Partial<Record<keyof T, any>>): PropsUtil<T> {
  const keys = Object.keys(propsDefines) as (keyof T & string)[];

  return {
    propsDefines,
    mix(instance: any, extra?: T | null | undefined): T {
      const opt = {} as T;
      keys.forEach((k) => (opt[k] = instance[k]));
      Object.assign(opt, extra);
      return opt;
    },
    watchAll(instance: Vue, onChange: (key: string, value: any) => void) {
      keys.forEach((k: string) => {
        instance.$watch(k, (value) => onChange(k, value));
      });
    },
  };
}

export function toValue(x: any) {
  if (typeof x === "function") x = x();
  return x;
}
