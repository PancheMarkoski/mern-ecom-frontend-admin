// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        enforce: "pre",
        test: /\.jsx?$/,
        loader: "source-map-loader",
        exclude: [/node_modules\/@antv/],
      });

      return webpackConfig;
    },
  },
};
