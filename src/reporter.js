const fs = require("fs");
const path = require("path");

const { error } = require("prettycli");
const glob = require("glob");
const client = require("prom-client");

const compressedSize = require("./compressed-size");

const METRIC_DEFAULT_NAME = "bundle_size_bytes_total";

const reporter = (tasks, options) => {
  const registry = new client.Registry();

  for (task of tasks) {
    // TODO: validate compression
    const metricName = task.metricName || METRIC_DEFAULT_NAME;

    if (!task.labels.compression) {
      task.labels.compression = "gzip";
    }

    const compression = task.labels.compression;

    // built-in task type
    if (task.type === "size") {
      console.log(options.cwd, task.path, fs.readdirSync(options.cwd));
      const paths = glob.sync(task.path, { cwd: options.cwd, absolute: true });
      if (!paths.length) {
        error(`There is no matching files for ${task.path} in ${process.cwd()}`, {
          silent: true,
        });
      } else {
        const files = [];
        paths.map(path => {
          const size = compressedSize(fs.readFileSync(path, "utf8"), compression);
          files.push({ path, size, compression });
        });

        let metric = registry.getSingleMetric(metricName);

        if (!metric) {
          metric = new client.Gauge({
            name: metricName,
            help: task.metricHelp || "help",
            labelNames: Object.keys(task.labels),
            registers: [registry],
          });
        }

        // calculate total size of all files matching glob
        const size = files.reduce((acc, file) => {
          acc += file.size;
          return acc;
        }, 0);

        // TODO: validate labels and throw error if labels
        // in different tasks with the same name are not equal
        metric.set(task.labels, size);
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
