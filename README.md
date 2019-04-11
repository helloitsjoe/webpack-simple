# Webpack Config

Generates a webpack config with simple defaults and extendable options.

## Installation

Install as a dev dependency:

```
npm i -D webpack-simple
```

## Basic Usage

```js
// webpack.config.js
const { makeWebpackConfig } = require('webpack-simple');
module.exports = makeWebpackConfig();
```

That's it!

This will generate a webpack config in `development` mode, with `babel-loader` set up with React defaults, and css/sass loaders with `modules: true` by default. It's the equivalent of:

```js
const config = {
  mode: 'development',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/.json$/, /node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true } },
          { loader: 'sass-loader', options: { modules: true } },
        ],
      },
    ],
  },
};
module.exports = config;
```

It's easy to add custom configuration:

```js
const productionConfig = makeWebpackConfig({ mode: 'production' });
const nodeTargeted = makeWebpackConfig({ target: 'node' });
const otherEntryAndOutput = makeWebpackConfig({
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'public'),
    file: 'bundle.js',
  },
});
```

You can add or overwrite entire module rules, or just add/overwrite/modify the default JS/CSS loaders:

// TODO: example
