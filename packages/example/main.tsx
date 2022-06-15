import * as React from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./store";
import { App } from "./components/App";

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<StoreProvider>
  <App />
</StoreProvider>);
