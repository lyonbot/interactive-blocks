import { IBContext } from "../IBContext";
import { head } from "../utils/iter";

/**
 * see under-the-hood.md - "Actions when Focused"
 *
 * this file also manages "hooks.keydown"
 */

const pluginName = "interaction-keydown";

export function setupInteractionKeydown(ctx: IBContext) {
  const document = ctx.domRoot;

  // ----------------------------------------------------------------
  // "hooks.keydown"

  const handleGlobalKeyDown = (ev: KeyboardEvent) => {
    const handled = ctx.hooks.keydown.call(ctx, ev);
    if (handled) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  };

  // no need to worry about "hooks.dispose"
  // -- handled by `hooks.focus` in <./interaction-select-focus.ts>

  ctx.hooks.focus.tap(pluginName, (_, onBlur) => {
    document.addEventListener("keydown", handleGlobalKeyDown as EventListener, true);
    onBlur(() => { document.removeEventListener("keydown", handleGlobalKeyDown as EventListener, true); });
  });

  // ----------------------------------------------------------------
  // navigating with keyboard

  ctx.hooks.keydown.tap(pluginName, (_, ev) => {
    const code = ev.code;
    if (code === "ArrowLeft") {
      const block = ctx.selectedSlot?.parent;
      const slot = block?.parent;
      if (block) ctx.selectBlock(block, "none", slot);
      return true;
    }

    if (code === "ArrowRight") {
      const block = head(ctx.selectedBlocks);
      const slot = head(block?.children);
      if (slot) ctx.selectSlot(slot, true);
      return true;
    }

    if (code === "ArrowUp" || code === "ArrowDown") {
      ctx.navigateInSlot(code === "ArrowUp" ? "up" : "down", ev);
      return true;
    }

    if (code === "Delete" || code === "Backspace") {
      ctx.remove();
      return true;
    }

    if (code === "KeyA" && (ev.ctrlKey || ev.metaKey)) {
      if (ctx.selectedSlot) ctx.selectSlot(ctx.selectedSlot, true);
      return true;
    }
  });
}
