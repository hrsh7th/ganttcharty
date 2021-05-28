const merge = require('webpack-merge').merge;
const path = require('path');
const config = require('./webpack.config');

module.exports = merge(config, {
  entry: {
    index: path.resolve(__dirname, 'debug/index.ts')
  },

  mode: 'development',

  devServer: {
    port: 8080,
    open: true,
    openPage: 'index.html',
    contentBase: path.resolve(__dirname, 'debug')
  },

  plugins: []
});

