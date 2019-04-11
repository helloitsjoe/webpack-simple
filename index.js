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
  babelPresets,
  babelPlugins,
  use = defaultJSUse,
} = {}) => {
  if (!babelPresets && !babelPlugins) {
    return {
      test: /\.jsx?$/,
      exclude,
      use,
    };
  }
  const babelLoaderIndex = use.findIndex(use => use.loader === 'babel-loader');
  if (babelLoaderIndex === -1) {
    throw new Error('Babel options provided but no Babel loader found');
  }

  const babelLoader = use[babelLoaderIndex];
  const useCopy = [
    ...use.slice(0, babelLoaderIndex),
    {
      ...babelLoader,
      options: {
        ...babelLoader.options,
        presets: babelPresets || babelLoader.options.presets,
        plugins: babelPlugins || babelLoader.options.plugins,
      },
    },
    ...use.slice(babelLoaderIndex + 1),
  ];
  return {
    test: /\.jsx?$/,
    exclude,
    use: useCopy,
  };
};

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
