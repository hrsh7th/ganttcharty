const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, './src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  }
};
