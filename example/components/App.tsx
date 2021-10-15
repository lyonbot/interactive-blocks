import * as React from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { BlockContext } from "@lyonbot/interactive-blocks";
import { MyBlock } from "./MyBlock";
import { MySlot } from "./MySlot";
import { useStore } from "../store";
import { BlockContextProvider } from "../hooks/useBlockContext";
import { useUnmount } from "../hooks/useUnmount";
import { classnames } from "../utils";
import { Introduction } from "./Introduction";

export const App = function () {
  const [data] = useStore();
  const [hasFocus, setHasFocus] = useState(false);

  const blockContext = useMemo(() => new BlockContext(), []);
  useUnmount(() => blockContext.dispose());
  useEffect(() => {
    blockContext.on("focus", () => setHasFocus(true));
    blockContext.on("blur", () => setHasFocus(false));
    blockContext.on("paste", (action) => {
      console.log("pasting...", action);
    });
  }, []);

  return <BlockContextProvider value={blockContext}>
    {Header}
    <div className={classnames("demoPage", hasFocus && "hasFocus")}>
      <div className="demoPage-blockArea">
        <MySlot>
          {data.map((item, index) => <MyBlock key={index} index={index} item={item} />)}
        </MySlot>
      </div>

      <div className="demoPage-introductionArea">
        <Introduction />
      </div>
    </div>
  </BlockContextProvider>;
};

const githubUrl = "https://github.com/lyonbot/interactive-blocks#readme";

const Header = <>
  <h2>InteractiveBlocks</h2>
  <p>Just proving the abilities with shabby Slot and Block components here.</p>
  <p>Learn how to integrate with your own components? <a href={githubUrl} target="_blank">Read the guide on GitHub</a></p>
  <a className="demoPage-forkMe" href={githubUrl} target="_blank">Fork me on GitHub</a>
</>;