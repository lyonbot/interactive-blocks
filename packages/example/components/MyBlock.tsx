import * as React from "react";
import { memo } from "react";
import { useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { useForceUpdate } from "../hooks";
import { MyDataItem, useStore } from "../store";
import { myDataItemToClipboardData, getPathFromOwnerBlock, classnames, getRandomEmoji } from "../utils";
import { MySlot } from "./MySlot";

import type { BlockHandler } from "@lyonbot/interactive-blocks";
import { useBlockHandler } from "@lyonbot/interactive-blocks-react";

export const MyBlock = memo(function MyBlock(props: { index: number; item: MyDataItem }) {
  const { index, item } = props;
  const [, dispatch] = useStore();
  const forceUpdate = useForceUpdate();
  const propsCache = useRef<{ index: number; item: MyDataItem }>();
  useImperativeHandle(propsCache, () => ({ index, item }), [index, item]);

  const { blockContext, blockHandler, handleBlockPointerUp, BlockWrapper } = useBlockHandler(
    () => ({
      data: () => myDataItemToClipboardData(propsCache.current!.item),
      index: () => propsCache.current!.index,
      onStatusChange: () => forceUpdate(),
    })
  );

  const dragEventHandlers = useMemo(
    () => blockContext.dragging.getDefaultBlockEventHandlers(blockHandler, "react") as any,
    []
  );

  const addChild = useCallback(() => {
    const path = getPathFromOwnerBlock(blockHandler); // current block's path, like [0,1,0]
    const newItem: MyDataItem = {
      name: `${getRandomEmoji()} ${(~~(Math.random() * 1e6 + 1e6)).toString(16).slice(-4).toUpperCase()}`,
    };

    dispatch({
      path,
      insert: {
        index: item.children?.length || 0,
        items: [newItem],
      },
    });
  }, [blockHandler]);

  const { activeNumber, isActive } = blockHandler;

  return <BlockWrapper>
    <div
      className={classnames("myBlock", isActive && "isActive")}
      tabIndex={-1}
      onPointerUp={handleBlockPointerUp}

      draggable
      {...dragEventHandlers}
    >
      {isActive && <div className="myBlock-selectIndex">{activeNumber as number + 1}</div>}

      <MyBlockName name={item.name} blockHandler={blockHandler} />

      <MySlot>
        {item.children?.length
          ? item.children.map((item, index) => <MyBlock key={index} index={index} item={item} />)
          : null}

        <button className="myBlock-addButton" onClick={addChild}>Create...</button>
      </MySlot>
    </div>
  </BlockWrapper>;
});


const MyBlockName = (props: { name: string; blockHandler: BlockHandler }) => {
  const [, dispatch] = useStore();
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((ev) => {
    const blockHandler = props.blockHandler;
    const path = getPathFromOwnerBlock(blockHandler);
    const name = ev.currentTarget.value;

    dispatch({ path, rename: { name } });
  }, []);

  return <input className="blockNameInput" type="text" value={props.name} onChange={handleChange} />;
};