// @ts-check

const fs = require("fs-extra");
const shell = require("shelljs");
const consola = require("consola");

consola.warn('Make sure you are in the projects ROOT! And you did update the version field in the package.json');
consola.start("Cleaning previous build files!");

fs.removeSync("./dist");

consola.success("Removed previous build files");
consola.start("Compiling the project...");

const tscOut = shell.exec("tsc").stdout;
if (tscOut.includes("error")) {
	consola.error("TSC Output contained a error!");
	process.exit(1);
}

consola.success("Project compiled!");
consola.start("Copy package.json to output files...");

fs.copyFileSync("./package.json", "./dist/package.json");
fs.copyFileSync("./README.md", "./dist/README.md");

consola.success("Copied package.json to output");
consola.start("Publishing to npm...");

shell.cd("./dist");
shell.exec("npm publish");

consola.success("Published!");
