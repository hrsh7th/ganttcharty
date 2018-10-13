const path = require('path');

module.exports = {

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

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }

};

