#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const program = require("commander");

const reporter = require("./lib/reporter");

const configPath = path.join(process.cwd(), "metrics.config.js");

program
  .option("--debug", "run in debug mode")
  .option("--config [config]", "Get path of configuration file")
  .parse(process.argv);

const config = require(program.config || configPath);

if (!config) {
  error("Config not found.", { silent: true });
}

// TODO: validate config

const metrics = reporter(config.tasks, { cwd: process.cwd() });

fs.writeFileSync(config.output, metrics);

process.on("unhandledRejection", function(reason) {
  console.log("Unhandled Promise");
  console.log(reason);
  process.exit(1);
});
