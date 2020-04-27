const { warn } = require("prettycli");

const debugMode = process.argv.indexOf("--debug") !== -1;

const debug = (label, data) => {
  if (debugMode) warn(`${label}: ${JSON.stringify(data, null, 2)}`);
};

module.exports = debug;
