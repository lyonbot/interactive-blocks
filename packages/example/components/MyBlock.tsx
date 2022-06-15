import * as React from "preact";
import { memo } from "preact/compat";
import { useCallback, useImperativeHandle, useMemo, useRef } from "preact/hooks";
import { useBlockContext, useOwnerSlot, useUnmount, useForceUpdate } from "../hooks";
import { MyDataItem, useStore } from "../store";
import { myDataItemToClipboardData, getPathFromOwnerBlock, classnames, getRandomEmoji } from "../utils";
import { MySlot } from "./MySlot";

import type { BlockHandler } from "@lyonbot/interactive-blocks";

export const MyBlock = memo(function MyBlock(props: { index: number; item: MyDataItem }) {
  const { index, item } = props;
  const [, dispatch] = useStore();
  const forceUpdate = useForceUpdate();
  const propsCache = useRef<{ index: number; item: MyDataItem }>();
  useImperativeHandle(propsCache, () => ({ index, item }), [index, item]);

  const blockContext = useBlockContext();
  const ownerSlot = useOwnerSlot();
  const blockHandler = useMemo(() => blockContext.createBlock({
    data: () => myDataItemToClipboardData(propsCache.current!.item),
    index: () => propsCache.current!.index,
    onStatusChange: () => forceUpdate(),
  }, ownerSlot), []);
  useUnmount(() => blockHandler.dispose());

  const onPointerUp = useCallback((ev: PointerEvent) => {
    blockHandler.handlePointerUp();
    if (document.activeElement === ev.currentTarget) blockHandler.ctx.focus();
  }, []);

  const dragEventHandlers = useMemo(
    () => blockContext.dragging.getDefaultBlockEventHandlers(blockHandler, "react"),
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

  return <div
    className={classnames("myBlock", isActive && "isActive")}
    tabIndex={-1}
    onPointerUp={onPointerUp}

    draggable
    {...dragEventHandlers}
  >
    {isActive && <div className="myBlock-selectIndex">{activeNumber as number + 1}</div>}

    <MyBlockName name={item.name} blockHandler={blockHandler} />

    <MySlot ownerBlock={blockHandler}>
      {item.children?.length
        ? item.children.map((item, index) => <MyBlock key={index} index={index} item={item} />)
        : null}

      <button className="myBlock-addButton" onClick={addChild}>Create...</button>
    </MySlot>
  </div>;
});


const MyBlockName = (props: { name: string; blockHandler: BlockHandler }) => {
  const [, dispatch] = useStore();
  const handleChange = useCallback<React.JSX.GenericEventHandler<HTMLInputElement>>((ev) => {
    const blockHandler = props.blockHandler;
    const path = getPathFromOwnerBlock(blockHandler);
    const name = ev.currentTarget.value;

    dispatch({ path, rename: { name } });
  }, []);

  return <input className="blockNameInput" type="text" value={props.name} onChange={handleChange} />;
};