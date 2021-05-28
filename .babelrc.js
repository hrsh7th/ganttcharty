module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          browsers: ['ie >= 11', 'last 2 versions']
        }
      }
    ],
    ['@babel/preset-react'],
    ['@babel/preset-typescript']
  ],
  plugins: [
    ['@babel/plugin-transform-runtime'],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true
      }
    ],
    ['@babel/plugin-transform-react-constant-elements'],
    ['@babel/plugin-transform-react-inline-elements'],
    ['babel-plugin-styled-components']
  ]
};
