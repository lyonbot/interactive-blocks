/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as React from "preact";
import { useContext } from "preact/hooks";
import type { BlockContext } from "copyable-blocks";

const bc = React.createContext<BlockContext>(null as any);
export const useBlockContext = () => useContext(bc);
export const BlockContextProvider = bc.Provider;
