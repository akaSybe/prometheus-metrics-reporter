const fs = require("fs");
const path = require("path");

const { warn, error } = require("prettycli");
const glob = require("glob");
const client = require("prom-client");
const registry = new client.Registry();

const compressedSize = require("./compressed-size");

const METRIC_DEFAULT_NAME = "bundle_size_bytes_total";

const reporter = (tasks, options) => {
  for (task of tasks) {
    const metricName = task.metricName || METRIC_DEFAULT_NAME;

    if (!task.labels.compression) {
      task.labels.compression = "gzip";
    }

    if (!task.labels.type) {
      task.labels.type = "none";
    }

    const compression = task.labels.compression;

    // built-in task type
    if (task.type === "size") {
      const paths = glob.sync(task.path, { cwd: options && options.cwd, absolute: true });
      if (!paths.length) {
        error(`There is no matching file for ${file.path} in ${process.cwd()}`, {
          silent: true,
        });
      } else {
        const files = [];
        paths.map(path => {
          const size = compressedSize(fs.readFileSync(path, "utf8"), compression);
          files.push({ path, size, compression });
        });

        const histogram = new client.Histogram({
          name: metricName,
          help: task.metricHelp || "help",
          labelNames: Object.keys(task.labels),
          registers: [registry],
          buckets: [],
        });

        // calculate total size of all files matching glob
        const size = files.reduce((acc, file) => {
          acc += file.size;
          return acc;
        }, 0);

        histogram.observe(task.labels, size);
      }
    } else {
      // custom task type
      // TODO: do something
      throw new Error("unknown task type");
    }
  }

  return registry.metrics();
};

module.exports = reporter;
