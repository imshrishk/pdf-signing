const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    "zlib": require.resolve("browserify-zlib"),
    "querystring": require.resolve("querystring-es3"),
    "path": require.resolve("path-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "http": require.resolve("stream-http"),
    "url": require.resolve("url"),
    "util": require.resolve("util"),
    "assert": require.resolve("assert/"),
    "net": require.resolve("net-browserify"),
    "fs": false,
    "process": require.resolve("process/browser")
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]);

  return config;
};
