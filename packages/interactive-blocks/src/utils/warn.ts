const warnedObjKeys = new WeakSet();
const warnedStrKeys = new Set();

/**
 * display warning message
 *
 * all messages with same `key`, only print once
 */
export function warn(key: any, msg: string, ...extra: any[]): void {
  const set = typeof key === "object" && key ? warnedObjKeys : warnedStrKeys;
  if (set.has(key)) return;

  set.add(key);
  console.warn(`[InteractiveBlocks] ${msg}`, ...extra);
}
