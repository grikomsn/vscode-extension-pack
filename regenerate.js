const { exec } = require("child_process");
const { writeFile } = require("fs");
const { join } = require("path");
const { promisify } = require("util");

const packageJson = require("./package.json");
const excludeJson = require("./exclude-extensions.json");

const isWin = process.platform === "win32";
const processName = isWin ? "code-insiders.cmd" : "code-insiders";
const command = `${processName} --list-extensions`;

(async () => {
  const { stdout } = await promisify(exec)(command);
  const extensionPack = stdout
    .trim()
    .split("\n")
    .filter((ext) => !excludeJson.some((exclude) => exclude === ext));

  const newPackageJson = { ...packageJson, extensionPack };
  await promisify(writeFile)(
    join(__dirname, "package.json"),
    `${JSON.stringify(newPackageJson, null, 2)}\n`
  );
})();
