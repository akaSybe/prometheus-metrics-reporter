module.exports = {
  output: "build/metrics.txt",
  tasks: [
    {
      type: "size",
      path: "build/*.js",
      labels: {
        compression: "gzip",
        type: "javascript",
        project: "x",
      },
      // metricName: "bundle_size_bytes_total", // default
    },
    {
      type: "size",
      path: "build/*.css",
      labels: {
        compression: "gzip",
        type: "css",
        project: "x",
      },
      // metricName: "bundle_size_bytes_total", // default
    },
  ],
};
