import * as React from "preact";
import { memo } from "preact/compat";
import { useCallback, useMemo, useState } from "preact/hooks";
import { BlockHandler } from "copyable-blocks";
import { useStore } from "../store";
import { useBlockContext } from "../hooks/useBlockContext";
import { OwnerSlotProvider } from "../hooks/useOwnerSlot";
import { useUnmount } from "../hooks/useUnmount";
import { classnames, clipboardDataToMyDataItem, getPathFromOwnerBlock } from "../utils";

export const MySlot = memo(function MySlot(props: { ownerBlock?: BlockHandler; children: React.ComponentChildren }) {
  const ownerBlock = props.ownerBlock || null;
  const [, dispatch] = useStore();
  const [isActive, setActive] = useState<boolean>(false);

  const blockContext = useBlockContext();
  const slotHandler = useMemo(() => blockContext.createSlot({
    onCut: (action) =>
      dispatch({
        path: getPathFromOwnerBlock(ownerBlock),
        remove: { indexes: action.blocks.map(block => block.index) },
      }),
    onPaste: (action) =>
      dispatch({
        path: getPathFromOwnerBlock(ownerBlock),
        insert: { index: action.index, items: action.data.blocksData.map(clipboardDataToMyDataItem) },
      }),
    onActiveStatusChange: (el) =>
      setActive(el.isActive),
  }, ownerBlock), []);
  useUnmount(() => slotHandler.dispose());

  const onPointerUp = useCallback((ev: PointerEvent) => {
    slotHandler.handlePointerUp();
    if (document.activeElement === ev.currentTarget) slotHandler.ctx.focus();
  }, []);

  return <div
    className={classnames("mySlot", isActive && "isActive")}
    tabIndex={-1}
    onPointerUp={onPointerUp}
  >
    <OwnerSlotProvider value={slotHandler}>
      {
        (props.children as any)?.length > 0
          ? props.children
          : <div className="mySlot-emptyPlaceholder">Nothing</div>
      }
    </OwnerSlotProvider>
  </div>;
});
