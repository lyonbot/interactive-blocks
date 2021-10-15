
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

    onDragHoverStatusChange: () => forceUpdate(),
    onMoveInSlot: (action) =>
      dispatch({
        path: getPathFromOwnerBlock(ownerBlock),
        moveInSlot: { fromIndexes: action.blocks.map(x => x.index), toIndex: action.index },
      }),
    onMoveToThisSlot: (action) =>
      dispatch({
        path: getPathFromOwnerBlock(ownerBlock),
        moveBetweenSlots: {
          fromPath: getPathFromOwnerBlock(action.fromSlot?.ownerBlock),
          fromIndexes: action.blocks.map(x => x.index),
          toIndex: action.index,
        },
      }),
  }, ownerBlock), []);
  useUnmount(() => slotHandler.dispose());

  const onPointerUp = useCallback((ev: PointerEvent) => {
    slotHandler.handlePointerUp();
    if (document.activeElement === ev.currentTarget) slotHandler.ctx.focus();
  }, []);

  const dragEventHandlers = useMemo(() => blockContext.dragging.getDefaultSlotEventHandlers(slotHandler), []);

  const { isActive, isDragHovering } = slotHandler;

  return <div
    className={classnames("mySlot", isActive && "isActive", isDragHovering && "isDragHovering")}
    tabIndex={-1}
    onPointerUp={onPointerUp}
    {...dragEventHandlers}
  >
    <OwnerSlotProvider value={slotHandler}>
      {
        (props.children as any)?.length > 0
          ? props.children
          : <div className="mySlot-emptyPlaceholder">Nothing</div>
      }
    </OwnerSlotProvider>

    {
      //-------------------------------------------------
      // this is a indicator for drag-and-drop, showing a bar at the indexToDrop
      // `mySlot` is a `display: grid` container, so we can control the position of indicator with `grid-row-start`
      // note:
      // 1. indicator's height is fixed so we can use negative marginBottom to avoid affecting blocks' position.
      // 2. `indexToDrop` is always valid number when `isDragHovering == true`

      slotHandler.isDragHovering &&
      <div className="mySlot-indexToDrop" key="indexToDrop" style={{ "grid-row-start": slotHandler.indexToDrop! + 1 }}>
        {`indexToDrop = ${slotHandler.indexToDrop}`}
      </div>
      //-------------------------------------------------
    }
  </div>;
});
