
import * as React from "preact";
import { memo } from "preact/compat";
import { useCallback, useMemo } from "preact/hooks";
import { useBlockContext, useUnmount, useForceUpdate } from "../hooks";
import { useStore } from "../store";
import { OwnerSlotProvider } from "../hooks/useOwnerSlot";
import { classnames, clipboardDataToMyDataItem, getPathFromOwnerBlock } from "../utils";

import type { BlockHandler } from "copyable-blocks";

export const MySlot = memo(function MySlot(props: { ownerBlock?: BlockHandler; children: React.ComponentChildren }) {
  const ownerBlock = props.ownerBlock || null;
  const [, dispatch] = useStore();
  const forceUpdate = useForceUpdate();

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
    onActiveStatusChange: () => forceUpdate(),
  }, ownerBlock), []);
  useUnmount(() => slotHandler.dispose());

  const onPointerUp = useCallback((ev: PointerEvent) => {
    slotHandler.handlePointerUp();
    if (document.activeElement === ev.currentTarget) slotHandler.ctx.focus();
  }, []);

  const { isActive } = slotHandler;

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
