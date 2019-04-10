const defaultJSExclude = [/\.json$/, /node_modules/];
const defaultBabelPresets = ['@babel/preset-env', '@babel/preset-react'];
const defaultBabelPlugins = ['@babel/plugin-proposal-class-properties'];
const defaultJSUse = [
  {
    loader: 'babel-loader',
    options: {
      presets: defaultBabelPresets,
      plugins: defaultBabelPlugins,
    },
  },
];

const makeJS = ({
  exclude = defaultJSExclude,
  // loader = 'babel-loader',
  // presets = defaultBabelPresets,
  // plugins = defaultBabelPlugins,
  use = defaultJSUse,
} = {}) => ({
  test: /\.jsx?$/,
  exclude,
  use,
});

// const makeTS = () => ({
//   test: /\.tsx?$/,
//   exclude: [/node_modules/],
//   use: [{ loader: 'ts-loader' }],
// });

const defaultCSSLoaderOptions = { modules: true };
const defaultCSSUse = [
  {
    loader: 'style-loader',
  },
  {
    loader: 'css-loader',
    options: defaultCSSLoaderOptions,
  },
  {
    loader: 'sass-loader',
    options: defaultCSSLoaderOptions,
  },
];

const makeCSS = ({ use = defaultCSSUse } = {}) => ({
  test: /\.s?css$/,
  use,
});

const defaultWebpackRules = [makeJS(), makeCSS()];

const makeWebpackConfig = ({
  entry,
  output,
  devtool,
  target = 'web',
  mode = 'development',
  rules = defaultWebpackRules,
} = {}) => ({
  mode,
  entry,
  output,
  target,
  devtool,
  module: {
    rules,
  },
});

module.exports = {
  makeWebpackConfig,
  makeJS,
  makeCSS,
  defaultWebpackRules,
  defaultBabelPlugins,
  defaultBabelPresets,
  defaultCSSLoaderOptions,
  defaultCSSUse,
  defaultJSExclude,
  defaultJSUse,
};
