require("cross-fetch/polyfill");

const { exec } = require("child_process");
const { join } = require("path");
const { promisify } = require("util");
const { writeFile } = require("fs");

const packageJson = require("./package.json");
const excludeJson = require("./exclude-extensions.json");

const isWin = process.platform === "win32";
const processName = isWin ? "code.cmd" : "code";
const command = `${processName} --list-extensions`;

const subjsJsonUrl = "https://link.surabayajs.org/vscode-json";

(async () => {
  /** @type {typeof packageJson} */
  const subjs = await fetch(subjsJsonUrl).then((res) => res.json());

  const excludes = [...excludeJson, ...subjs.extensionPack];

  const { stdout } = await promisify(exec)(command);
  const extensionPack = stdout
    .trim()
    .split("\n")
    .filter((ext) => !excludes.some((exclude) => exclude === ext));

  const newPackageJson = { ...packageJson, extensionPack };
  await promisify(writeFile)(
    join(__dirname, "package.json"),
    `${JSON.stringify(newPackageJson, null, 2)}\n`
  );
})();
