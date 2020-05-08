const fs = require("fs");

const { error } = require("prettycli");
const glob = require("glob");
const client = require("prom-client");

const compressedSize = require("./compressed-size");

const METRIC_DEFAULT_NAME = "bundle_size_bytes_total";

const reporter = (tasks, options) => {
  const registry = new client.Registry();

  for (task of tasks) {
    // built-in task type
    if (task.type === "size") {
      // TODO: validate compression
      const metricName = task.metricName || METRIC_DEFAULT_NAME;

      if (!task.labels.compression) {
        task.labels.compression = "gzip";
      }

      const compression = task.labels.compression;

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
            help: "calculates bundle size",
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
    } else if (task.type === "custom") {
      // fast-fail
      if (typeof task.resolve !== "function") {
        throw new Error(
          "custom task should have 'resolve' method returning one of prom-client metrics",
        );
      }

      const metric = task.resolve(client);

      // TODO: validate somehow returned metric...

      registry.registerMetric(metric);
    } else {
      throw new Error("unknown task type");
    }
  }

  return registry.metrics();
};

module.exports = reporter;
