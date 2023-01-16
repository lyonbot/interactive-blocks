/**
 * Something with "ctrlKey" and "shiftKey" properties.
 *
 * for example, `Event` objects.
 */

export interface WithModifierKeys {
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

export type MultipleSelectType = "none" | "ctrl" | "shift" | WithModifierKeys | boolean | undefined | null;
export type NormalizedMultipleSelectType = "none" | "ctrl" | "shift";

export function normalizeMultipleSelectType(value: MultipleSelectType): NormalizedMultipleSelectType {
  if (!value) return "none";
  if (value === true) return "ctrl";

  if (typeof value === "object") {
    if (value.ctrlKey || value.metaKey) return "ctrl";
    else if (value.shiftKey) return "shift";
    return "none";
  }

  if (value === "ctrl") return "ctrl";
  if (value === "shift") return "shift";
  return "none";
}
