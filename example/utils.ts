import { BlockHandler } from "copyable-blocks";
import type { MyDataItem } from "./store";

export const clipboardDataToMyDataItem = (x: any): MyDataItem => {
  return { ...x };
};

export const myDataItemToClipboardData = (x: MyDataItem): any => {
  return { ...x };
};

export const getPathFromOwnerBlock = (block: BlockHandler | null) => {
  const ans = [] as number[];
  while (block) {
    ans.unshift(block.index);
    block = block.ownerSlot!.ownerBlock;
  }
  return ans;
};

export const classnames = (...args: any[]): string => {
  return args.filter(x => !!x).map(x => Array.isArray(x) ? classnames(x) : String(x)).join(" ");
};