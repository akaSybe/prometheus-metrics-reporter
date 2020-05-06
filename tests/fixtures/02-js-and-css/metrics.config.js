module.exports = {
  output: "build/metrics.txt",
  tasks: [
    {
      type: "size",
      path: "build/*.js",
      labels: {
        compression: "gzip",
        type: "javascript",
        project: "project1",
      },
    },
    {
      type: "size",
      path: "build/*.css",
      labels: {
        compression: "gzip",
        type: "css",
        project: "project1",
      },
    },
  ],
};
