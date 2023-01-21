/* eslint-disable @typescript-eslint/ban-ts-comment */

import { TypedEmitter } from "tiny-typed-emitter";
import { IBContext } from "./IBContext";
import { IBElement } from "./IBElement";
import { emptyFn } from "./utils/fn";

interface IBElementFundamental {
  options: any;

  is: string;
  ctx: IBContext;
  depth: number;

  parent: IBElementFundamental | null;
  children: Set<IBElementFundamental>;

  domElement: HTMLElement | null | undefined;
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
  abstract options: any;

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
    this.domElement = null;
    this.parent?.children.delete(this);
  }

  abstract get isSelected(): boolean;

  get hasFocus() {
    return this.isSelected && this.ctx.hasFocus;
  }

  /**
   * check if this is a descendant of `el`.
   *
   * - if `el === this` return true
   * - if `el` is Nullish, return false
   */
  isDescendantOf(el: IBElement) {
    if (!el) return false;
    if (el.depth > this.depth) return false;

    let ptr: IBElementFundamental | null = this;
    while (ptr) {
      if (ptr === el) return true;
      ptr = ptr.parent;
    }
    return false;
  }

  // ----------------------------------------------------------------
  // UI Related

  #lastDOM: HTMLElement | null = null;
  set domElement(newDOM: HTMLElement | null | undefined) {
    newDOM = newDOM instanceof HTMLElement ? newDOM : null;

    const lastDOM = this.#lastDOM;
    if (newDOM === lastDOM) return;

    if (lastDOM) {
      const ctxLastPtr = this.ctx.dom2el.get(lastDOM);
      if (ctxLastPtr === this as any) this.ctx.dom2el.delete(lastDOM);
    }

    if (newDOM) {
      this.ctx.dom2el.set(newDOM, this as any);
    }

    this.#lastDOM = newDOM;
  }
  get domElement() {
    let ans = this.#lastDOM;
    if (ans && !ans.parentNode) this.domElement = (ans = null);
    return ans;
  }
}