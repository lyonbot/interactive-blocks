
import * as React from "react";
import { memo } from "react";
import { useMemo } from "react";
import { useNewSlotHandler } from "@lyonbot/interactive-blocks-react";
import { useForceUpdate } from "../hooks";
import { useStore } from "../store";
import { classnames, clipboardDataToMyDataItem, getPathFromOwnerBlock } from "../utils";

export const MySlot = memo(function MySlot(props: { children: React.ReactNode }) {
  const [, dispatch] = useStore();
  const forceUpdate = useForceUpdate();

  const { ownerBlock, blockContext, slotHandler, handleSlotPointerUp, SlotWrapper } = useNewSlotHandler(() => ({
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
    onStatusChange: () => forceUpdate(),

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
  }));

  const dragEventHandlers = useMemo(
    () => blockContext.dragging.getDefaultSlotEventHandlers(slotHandler, "react") as any,
    []
  );

  const { isActive, isDragHovering } = slotHandler;

  return <div
    className={classnames("mySlot", isActive && "isActive", isDragHovering && "isDragHovering")}
    tabIndex={-1}
    onPointerUp={handleSlotPointerUp}
    {...dragEventHandlers}
  >
    <SlotWrapper>
      {
        (props.children as any)?.length > 0
          ? props.children
          : <div className="mySlot-emptyPlaceholder">Empty</div>
      }
    </SlotWrapper>

    {
      //-------------------------------------------------
      // this is a indicator for drag-and-drop, showing a bar at the indexToDrop
      // `mySlot` is a `display: grid` container, so we can control the position of indicator with `grid-row-start`
      // note:
      // 1. indicator's height is fixed so we can use negative marginBottom to avoid affecting blocks' position.
      // 2. `indexToDrop` is always valid number when `isDragHovering == true`

      slotHandler.isDragHovering &&
      <div className="mySlot-indexToDrop" key="indexToDrop" style={{ gridRowStart: slotHandler.indexToDrop! + 1 }}>
        {`indexToDrop = ${slotHandler.indexToDrop}`}
      </div>
      //-------------------------------------------------
    }
  </div>;
});
