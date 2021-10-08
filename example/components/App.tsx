import * as React from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { BlockContext } from "copyable-blocks";
import { MyBlock } from "./MyBlock";
import { MySlot } from "./MySlot";
import { useStore } from "../store";
import { BlockContextProvider } from "../hooks/useBlockContext";
import { useUnmount } from "../hooks/useUnmount";
import { classnames } from "../utils";

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
    <div className={classnames("demoPage", hasFocus && "hasFocus")}>
      <MySlot>
        {data.map((item, index) => <MyBlock key={index} index={index} item={item} />)}
      </MySlot>
    </div>
  </BlockContextProvider>;
};
