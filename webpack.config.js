const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      }
    ]
  }
};

