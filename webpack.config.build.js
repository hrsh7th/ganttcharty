const merge = require('webpack-merge');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('./webpack.config');

module.exports = merge(config, {
  entry: {
    index: path.resolve(__dirname, 'src/index.tsx')
  },

  mode: 'production',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js',
    library: 'GanttCharty',
    libraryTarget: 'umd'
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    })
  ]
});

