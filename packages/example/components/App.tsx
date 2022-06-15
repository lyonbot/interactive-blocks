import * as React from "react";
import { useState } from "react";
import { BlockContext } from "@lyonbot/interactive-blocks";
import { ReactInteractiveBlocksRoot } from "@lyonbot/interactive-blocks-react";
import { MyBlock } from "./MyBlock";
import { MySlot } from "./MySlot";
import { useStore } from "../store";
import { classnames } from "../utils";
import { Introduction } from "./Introduction";

export const App = function () {
  const [data] = useStore();
  const [hasFocus, setHasFocus] = useState(false);

  const handleBlockContextReady = React.useCallback(
    (blockContext: BlockContext) => {
      blockContext.on("focus", () => setHasFocus(true));
      blockContext.on("blur", () => setHasFocus(false));
      blockContext.on("paste", (action) => {
        console.log("pasting...", action);
      });

      // --------------------
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore -- for debugging
      window.blockContext = blockContext;

    }, []);

  return <ReactInteractiveBlocksRoot onMount={handleBlockContextReady}>
    {Header}
    <div className={classnames("demoPage", hasFocus && "hasFocus")}>
      <div className="demoPage-introductionArea">
        <Introduction />
      </div>

      <div className="demoPage-blockArea">
        <MySlot>
          {data.map((item, index) => <MyBlock key={index} index={index} item={item} />)}
        </MySlot>
      </div>
    </div>
  </ReactInteractiveBlocksRoot>;
};

const githubUrl = "https://github.com/lyonbot/interactive-blocks";
const docsUrl = "https://lyonbot.github.io/interactive-blocks/docs/";

const Header = <>
  <h2>InteractiveBlocks</h2>
  <p>Just proving the abilities with shabby Slot and Block components here.</p>
  <p>Learn how to integrate with your own components? <a href={docsUrl} target="_blank">Read the Document &raquo;</a></p>
  <a className="demoPage-forkMe" href={githubUrl} target="_blank">Fork me on GitHub</a>
</>;
