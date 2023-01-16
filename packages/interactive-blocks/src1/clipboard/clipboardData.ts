export interface IBClipboardData {
  readonly isIBClipboardData: true;
  readonly ibContextBrand: string;
  readonly ibContextUUID?: string;
  readonly blocksData: any[];
}

export function isIBClipboardData(data: any, limitToBrand?: string): data is IBClipboardData {
  if (typeof data !== "object" || !data) return false;

  if (data.isIBClipboardData !== true) return false;
  if (typeof limitToBrand === "string" && limitToBrand !== data.ibContextBrand) return false;
  if (typeof data.ibContextBrand !== "string") return false;

  if ("ibContextUUID" in data && typeof data.ibContextUUID !== "string") return false;
  if (!Array.isArray(data.blocksData)) return false;
  if (data.blocksData.some((x: any) => typeof x !== "object" || x === null)) return false;

  return true;
}
