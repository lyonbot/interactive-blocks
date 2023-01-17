import { IBContext } from "../IBContext";
import { BlockSerializer } from "../types";

const defaultSerializer: BlockSerializer = {
  parse: str => JSON.parse(str),
  stringify: object => JSON.stringify(object),
};

export const isContextMultipleSelect = (ctx: IBContext) => ctx.options.multipleSelect ?? true;
export const getSerializer = (ctx: IBContext) => ctx.options.serializer ?? defaultSerializer;
