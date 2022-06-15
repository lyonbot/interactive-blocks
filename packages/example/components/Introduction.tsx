import * as React from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { useStore } from "../store";

/**
 * The Introduction text and a store viewer / editor
 *
 * for demo page.
 */
export const Introduction = () => {
  const [store, dispatch] = useStore();
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textarea.current!.value = JSON.stringify(store, null, 2);
  }, [store]);

  const storeRef = useRef<typeof store>(null);
  storeRef.current = store;
  const applyNewText = useCallback((resetIfFail = true) => {
    try {
      const newData = JSON.parse(textarea.current!.value);
      dispatch({
        path: [],
        __demo_wholeReplace__: newData,
      });
    } catch (e) {
      if (resetIfFail)
        textarea.current!.value = JSON.stringify(storeRef.current, null, 2);
      console.error("Failed to replace: ", e);
    }
  }, []);

  const handleBlur = useCallback(() => applyNewText(true), []);
  const handleInput = useCallback(() => applyNewText(false), []);

  return <div>
    <h3>How to Play</h3>
    <ol>
      <li>click to <b>pick block &amp; slot</b></li>
      <li><b>multiple-select</b> with <kbd>Ctrl</kbd> or <kbd>Shift</kbd></li>
      <li><b>navigate</b> with arrow keys</li>
      <li><b>copy, cut, paste</b> with <kbd>Ctrl+C</kbd> / <kbd>Ctrl+X</kbd> / <kbd>Ctrl+V</kbd></li>
      <li>Drag and drop. Also supports cross-window dragging.</li>
    </ol>

    <h3>Current Data</h3>
    <textarea class="demoPage-store" spellcheck={false} ref={textarea} onBlur={handleBlur} onInput={handleInput}></textarea>
  </div>;
};
