[![Build Status](https://travis-ci.org/akaSybe/prometheus-metrics.svg?branch=master)](https://travis-ci.org/akaSybe/prometheus-metrics)

# prometheus-metrics

Utility to generate prometheus metrics based on tasks from config

## How to use

#### Install

`npm install @akasybe/prometheus-metrics --save-dev`

#### Create config file

Create file `metrics.config.js` in root directory:

```js
module.exports = {
  output: "build/metrics.txt",
  tasks: [
    {
      type: "size",
      path: "build/*.js",
      labels: {
        compression: "gzip",
        type: "javascript",
        project: "app",
      },
    },
    {
      type: "custom",
      // client is default export from 'prom-client' library
      resolve: function(client) {
        // you can create any valid metric, please refer to 'prom-client' docs
        const metric = new client.Counter({
          name: "metric_name",
          help: "metric_help",
        });

        // calculate metric value
        metric.inc(1);

        // and do not forget to return metric
        return metric;
      },
    },
  ],
};
```

#### Add script

Add script in `package.json`:

```json
"scripts": {
  "metrics": "prometheus-metrics"
}
```

#### Run

`npm run metrics`

Now go to `output` directory and look at `metrics.txt` file
