const cosmiconfig = require("cosmiconfig");
const { error } = require("prettycli");

const explorer = cosmiconfig("prometheus-metrics", { searchPlaces: ["metrics.config.js"] });
const result = explorer.searchSync();

let config;

if (result) {
  config = result.config.tasks;
}

if (!config) {
  error(`Config not found.`, { silent: true });
}

debug("config", config);

module.exports = config;
