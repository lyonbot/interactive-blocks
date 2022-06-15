import * as React from "react";
import * as ReactDOM from "react-dom";
import { StoreProvider } from "./store";
import { App } from "./components/App";

const container = document.getElementById("app")!;
ReactDOM.render(<StoreProvider>
  <App />
</StoreProvider>
, container);
