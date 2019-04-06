const makeJS = () => ({
  test: /\.jsx?$/,
  exclude: [/\.json$/, /node_modules/],
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
  },
});

const makeTS = () => ({
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: { loader: 'ts-loader' },
});

const makeCSS = () => ({
  test: /\.s?css$/,
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
      options: { modules: true },
    },
    {
      loader: 'sass-loader',
      options: { modules: true },
    },
  ],
});

const makeConfig = ({ js = true, css = true, ts = false } = {}) => ({
  module: {
    rules: [js && makeJS(), css && makeCSS(), ts && makeTS()].filter(Boolean),
  },
});

module.exports = makeConfig;
