/* eslint-env amd */
require.config({
  map: {
    "*": {
      "copyable-blocks": "/dist/index.umd.js",
      "preact": "/node_modules/preact/dist/preact.umd.js",
      "preact/compat": "/node_modules/preact/compat/dist/compat.umd.js",
      "preact/hooks": "/node_modules/preact/hooks/dist/hooks.umd.js",
      "preact/devtools": "/node_modules/preact/devtools/dist/devtools.umd.js",
      "preact/debug": "/node_modules/preact/debug/dist/debug.umd.js",
      "eventemitter3": "/node_modules/eventemitter3/umd/eventemitter3.min.js",
    },
  },
});

define("tiny-typed-emitter", ["eventemitter3"], (TypedEmitter) => ({ TypedEmitter }));

require(["./main"]);