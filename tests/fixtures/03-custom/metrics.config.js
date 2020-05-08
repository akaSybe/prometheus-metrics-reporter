module.exports = {
  output: "build/metrics.txt",
  tasks: [
    {
      type: "custom",
      resolve: function(client) {
        const counter = new client.Counter({
          name: "metric_name",
          help: "metric_help",
        });

        counter.inc(1);

        return counter;
      },
    },
  ],
};
