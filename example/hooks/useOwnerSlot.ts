/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as React from "preact";
import { useContext } from "preact/hooks";
import type { SlotHandler } from "@lyonbot/interactive-blocks";

const OwnerSlot = React.createContext(null as SlotHandler | null);
OwnerSlot.displayName = "OwnerSlot";

export const useOwnerSlot = () => useContext(OwnerSlot);
export const OwnerSlotProvider = OwnerSlot.Provider;
export const OwnerSlotConsumer = OwnerSlot.Consumer;
