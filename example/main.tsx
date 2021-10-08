import * as React from "preact";
import { StoreProvider } from "./store";
import { App } from "./components/App";
import "preact/debug";

React.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("app")
);
