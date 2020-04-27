# prometheus-metrics

requires `metrics.config.js` file in the project root:

```
module.exports = {
  // output file
  output: "build/metrics.txt",
  // tasks
  tasks: [
    {
      // size or custom
      type: "size",
      // glob pattern
      path: "build/*.js",
      // metric labels
      labels: {
        compression: "gzip",
        type: "javascript",
        project: "x",
      },
    },
  ],
};
```
