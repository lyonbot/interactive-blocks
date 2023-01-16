/* eslint-disable @typescript-eslint/ban-ts-comment */

import { TypedEmitter } from "tiny-typed-emitter";
import { IBContext } from "./IBContext";
import { emptyFn } from "./utils/fn";

interface IBElementFundamental {
  options: any;
  ctx: IBContext;
  depth: number;
  children: Set<IBElementFundamental>;
  lastDOMElement: HTMLElement | null | undefined;
  dispose(): void;
}

type IBElementFundamentalEvent = "dispose";

/**
 * The base class for IBSlot and IBBlock
 *
 * TODO:
 *
 * - in `constructor`, call `ctx.hooks.xxxCreated(this)`
 * - implement `get isSelected()`
 * - implement `dispose()`
 */
export abstract class IBElementBase<
  TypeName extends "slot" | "block",
  Events extends { [E in IBElementFundamentalEvent | keyof Events]: (...args: any[]) => any },
  ParentType extends IBElementFundamental,
  ChildType extends IBElementFundamental = ParentType
> extends TypedEmitter<Events> implements IBElementFundamental {
  abstract options: any

  readonly is: TypeName;
  readonly ctx: IBContext;
  readonly depth: number;

  readonly parent: ParentType | null;
  readonly children: Set<ChildType>;

  constructor(is: TypeName, parent: IBContext | ParentType) {
    super();
    this.is = is;

    if (parent instanceof IBContext) {
      this.ctx = parent;
      this.parent = null;
      this.depth = 0;
    } else {
      this.ctx = parent.ctx;
      this.parent = parent;
      this.depth = parent.depth + 1;

      parent.children.add(this);
    }

    this.children = new Set();
  }

  dispose() {
    this.dispose = emptyFn;  // avoid duplicated call

    this.children.forEach(child => child.dispose());
    this.children.clear();

    // @ts-ignore
    this.emit("dispose", this);
    this.lastDOMElement = null;
    this.parent?.children.delete(this);
  }

  abstract get isSelected(): boolean;

  get hasFocus() {
    return this.isSelected && this.ctx.hasFocus;
  }

  // ----------------------------------------------------------------
  // UI Related

  lastDOMElement: HTMLElement | null | undefined; // managed by <./core-internals/interaction-select-focus.ts>
  handlePointerDown!: (ev: PointerEvent) => void; // injected by <./core-internals/interaction-select-focus.ts>

}
