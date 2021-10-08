import * as React from "preact";
import { memo } from "preact/compat";
import { useCallback, useImperativeHandle, useMemo, useRef, useState } from "preact/hooks";
import { useBlockContext } from "../hooks/useBlockContext";
import { MySlot } from "./MySlot";
import { MyDataItem, useStore } from "../store";
import { useOwnerSlot } from "../hooks/useOwnerSlot";
import { useUnmount } from "../hooks/useUnmount";
import { BlockHandler } from "copyable-blocks";
import { myDataItemToClipboardData, getPathFromOwnerBlock, classnames } from "../utils";

export const MyBlock = memo(function MyBlock(props: { index: number; item: MyDataItem }) {
  const { index, item } = props;
  const propsCache = useRef<{ index: number; item: MyDataItem }>();
  useImperativeHandle(propsCache, () => ({ index, item }), [index, item]);

  const [activeNumber, setActiveNumber] = useState<false | number>(false);
  const isActive = activeNumber !== false;

  const blockContext = useBlockContext();
  const ownerSlot = useOwnerSlot();
  const blockHandler = useMemo(() => blockContext.createBlock({
    data: () => myDataItemToClipboardData(propsCache.current!.item),
    index: () => propsCache.current!.index,
    onActiveStatusChange: (block) => setActiveNumber(block.activeNumber),
  }, ownerSlot), []);
  useUnmount(() => blockHandler.dispose());

  const onPointerUp = useCallback((ev: PointerEvent) => {
    blockHandler.handlePointerUp();
    if (document.activeElement === ev.currentTarget) blockHandler.ctx.focus();
  }, []);

  return <div
    className={classnames("myBlock", isActive && "isActive")}
    tabIndex={-1}
    onPointerUp={onPointerUp}
  >
    {isActive && <div className="myBlock-selectIndex">{activeNumber + 1}</div>}

    <MyBlockName name={item.name} blockHandler={blockHandler} />

    <MySlot ownerBlock={blockHandler}>
      {item.children?.length
        ? item.children.map((item, index) => <MyBlock key={index} index={index} item={item} />)
        : null}
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