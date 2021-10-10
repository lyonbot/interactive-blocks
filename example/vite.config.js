/* eslint-env node */
import * as path from "path";

export default {
  mode: "development",
  root: __dirname,
  resolve: {
    alias: {
      "events": "eventemitter3",
      "copyable-blocks": path.resolve(__dirname, ".."),
    },
  },
};
