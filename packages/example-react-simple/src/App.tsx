import * as React from "react";
import { ReactInteractiveBlocksRoot } from "@lyonbot/interactive-blocks-react";
import { MyBlock } from "./components/MyBlock";
import "./style.scss";

// ************************************************************************************************
// Main App

export function App() {
  return (
    <div>
      <h1><a href="https://github.com/lyonbot/interactive-blocks">InteractiveBlocks</a> x React</h1>
      <p>select some child cards, and press arrow keys, Ctrl+A, Ctrl+C, Ctrl+V etc</p>

      <ReactInteractiveBlocksRoot>
        <MyBlock path={[]} />
      </ReactInteractiveBlocksRoot>
    </div>
  );
}
