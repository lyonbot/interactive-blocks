import { IBContextOptions } from "./definitions";
import { IBContext } from "./IBContext";
import { IBSlot } from "./IBElement";

export interface IBAction {
  is: string;
  ctx: IBContext;
}

export interface IBInsertAction extends IBAction {
  is: "insert";

  slot: IBSlot;

  /** insert into which position in this `slot` */
  index: number;

  /** a list of raw block data. see {@link IBContextOptions#serializer} */
  itemsData: any[];
}

export interface IBRemoveAction extends IBAction {
  is: "remove";

  slot: IBSlot;

  /**
   * the indexes of blocks to be cut, listed in selection order
   *
   * @see indexesDescending - to safely delete items, use this
   *
   * ```js
   * action.indexesDescending.forEach(index => array.splice(index, 1))
   * ```
   */
  indexes: number[];

  /**
   * the indexes of blocks to be cut, in numerical descending order
   *
   * ```js
   * // safely delete items one-by-one
   * action.indexesDescending.forEach(index => array.splice(index, 1))
   * ```
   */
  indexesDescending: number[];
}

export interface IBMoveAction extends IBAction {
  is: "move";

  slot: IBSlot;

  /**
   * the indexes of blocks to be cut, listed in selection order
   */
  indexes: number[];

  /**
   * the new position of the first block
   */
  toIndex: number;
}

export interface IBTransferIntoAction extends IBAction {
  is: "transferInto";

  slot: IBSlot;

  /** insert into which position in this `slot` */
  index: number;

  /**
   * where the blocks come from.
   *
   * Note: you shall remove the blocks from `fromSlot`
   */
  fromSlot: IBSlot;

  /**
   * the block indexes in `fromSlot`, listed in selection order
   *
   * Note: you shall remove the blocks from `fromSlot`
   */
  fromIndexes: number[];
}
