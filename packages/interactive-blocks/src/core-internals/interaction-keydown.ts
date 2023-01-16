import { IBContext } from "../IBContext";
import { head } from "../utils/iter";

/**
 * see under-the-hood.md - "Actions when Focused"
 *
 * this file also manages "hooks.keydown"
 */

const pluginName = "interaction-keydown";

export function setupInteractionKeydown(ctx: IBContext) {

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
    document.addEventListener("keydown", handleGlobalKeyDown, true);
    onBlur(() => { document.removeEventListener("keydown", handleGlobalKeyDown, true); });
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
      if (slot) ctx.selectSlot(slot, "children");
      return true;
    }
  });
}
