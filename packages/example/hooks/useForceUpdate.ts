import { useReducer } from "preact/hooks";

export const useForceUpdate = () => {
  const [, r] = useReducer(x => (x + 1) % 0xffffff, 0);
  return r as () => void;
};