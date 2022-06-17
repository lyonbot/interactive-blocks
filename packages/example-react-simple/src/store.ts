import { createStore } from "./utils/createStore";

// ************************************************************************************************
// Global Store: all component can access directly

export const store = createStore<DataItem>({
  name: "root card",
  children: [
    { name: "child1" },
    { name: "child2" },
  ],
});

export interface DataItem {
  name: string;
  children?: DataItem[];
}
