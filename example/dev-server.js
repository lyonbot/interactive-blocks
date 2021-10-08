/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

var express = require("express");
var http = require("http");
var chokidar = require("chokidar");
var child_process = require("child_process");
var fs = require("fs");
var path = require("path");
var reload = require("reload");
var debounce = require("lodash.debounce");
var typescript = require("typescript");

// -----------------------------
const microbundle = child_process.spawn("npx microbundle watch", {
  cwd: process.cwd(),
  env: process.env,
  stdio: [0, "inherit", "inherit"],
  shell: true,
});
process.on("beforeExit", () => {
  microbundle.kill();
});
// -----------------------------

var app = express();
var publicDir = path.join(__dirname, "..");
app.set("port", process.env.PORT || 3000);

app.get("/", function (req, res) {
  res.redirect("/example/index.html");
});

app.get("/example/*.js", function (req, res, next) {
  const basePath = path.join(publicDir, req.path.slice(1, -3));
  let resolvedPath = "";

  if (fs.existsSync(`${basePath}.ts`)) resolvedPath = `${basePath}.ts`;
  else if (fs.existsSync(`${basePath}.tsx`)) resolvedPath = `${basePath}.tsx`;
  else return next();

  fs.readFile(resolvedPath, "utf8", function (err, data) {
    if (err) {
      res.status(500).end(String(err));
      return;
    }

    const js = typescript.transpile(data, {
      jsx: typescript.JsxEmit.React,
      target: typescript.ScriptTarget.ES2017,
      module: typescript.ModuleKind.AMD,
      inlineSourceMap: true,
      inlineSources: true,
      isolatedModules: true,
    }, path.relative(publicDir, resolvedPath));

    res.type(".js").end(js);
  });
});

app.use(express.static(publicDir));

var server = http.createServer(app);

reload(app)
  .then(function (reloadReturned) {
    server.listen(app.get("port"), function () {
      console.log(`Web server listening on http://127.0.0.1:${app.get("port")}`);
    });

    const reload = debounce(() => {
      console.log("Web server reloading...");
      reloadReturned.reload();
    }, 500);

    chokidar
      .watch([path.join(publicDir, "example"), path.join(publicDir, "dist")])
      .on("all", reload);
  })
  .catch(function (err) {
    console.error("Reload could not start, could not start server/sample app", err);
  });
