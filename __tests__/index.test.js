const {
  makeWebpackConfig,
  defaultWebpackRules,
  defaultBabelPlugins,
  defaultBabelPresets,
  defaultJSExclude,
  defaultJSUse,
  defaultCSSUse,
  defaultCSSLoaderOptions,
  makeJS,
  makeTS,
  makeCSS,
} = require('../index');

const DEFAULT_RULES_LENGTH = 2;
const DEFAULT_EXCLUDE_LENGTH = 2;

const customUse = [{ loader: 'other-loader', options: { foo: 'bar' } }];

describe('makeWebpackConfig', () => {
  const defaultConfig = makeWebpackConfig();
  const newRules = [{ test: /\.js$/, use: [{ loader: 'other-loader' }] }];

  it('Rules include js and css by default', () => {
    expect(defaultConfig.module.rules.length).toBe(DEFAULT_RULES_LENGTH);
    expect(defaultConfig.module.rules[0]).toEqual(makeJS());
    expect(defaultConfig.module.rules[1]).toEqual(makeCSS());
  });

  it('Passing ts: true adds default typescript', () => {
    const config = makeWebpackConfig({ ts: true });
    expect(config.module.rules.find(rule => rule.test.test('.tsx'))).toEqual(makeTS());
  });

  it('Passing ts object adds custom typescript config', () => {
    const ts = { test: /\.tsx?$/, foo: 'bar' };
    const config = makeWebpackConfig({ ts });
    expect(config.module.rules.find(rule => rule.test.test('.tsx'))).toEqual(ts);
  });

  it('passing ts adds extensions to resolve', () => {
    const config = makeWebpackConfig({ ts: true });
    expect(config.resolve.extensions).toEqual(['.ts', '.tsx', '.js', '.json']);
  });

  it('User can add to `rules` array', () => {
    const config = makeWebpackConfig({
      rules: [...defaultWebpackRules, ...newRules],
    });
    const { rules } = config.module;
    expect(rules.length).toBe(DEFAULT_RULES_LENGTH + 1);
    expect(rules[rules.length - 1]).toEqual(...newRules);
  });

  it('User can overwrite `rules` array', () => {
    const config = makeWebpackConfig({
      rules: newRules,
    });
    expect(config.module.rules.length).toBe(1);
    expect(config.module.rules).toEqual(newRules);
  });

  it('User can update JS', () => {
    const js = makeJS({ use: customUse });
    const config = makeWebpackConfig({ js });
    expect(config.module.rules[0]).toEqual(js);
    // Should not affect other rules
    expect(config.module.rules[1]).toEqual(makeCSS());
    expect(config.module.rules.length).toBe(2);
  });

  it('User can update CSS', () => {
    const css = makeCSS({ use: customUse });
    const config = makeWebpackConfig({ css });
    expect(config.module.rules[1]).toBe(css);
    // Should not affect other rules
    expect(config.module.rules[0]).toEqual(makeJS());
    expect(config.module.rules.length).toBe(2);
  });

  it('default config', () => {
    expect(defaultConfig).toEqual({
      mode: 'development',
      target: 'web',
      module: {
        rules: [
          {
            exclude: [/\.json$/, /node_modules/],
            test: /\.jsx?$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  plugins: ['@babel/plugin-proposal-class-properties'],
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                },
              },
            ],
          },
          {
            test: /\.s?css$/,
            use: [
              { loader: 'style-loader' },
              { loader: 'css-loader', options: { modules: true } },
              { loader: 'sass-loader' },
            ],
          },
        ],
      },
    });
  });

  describe('config options', () => {
    const testObject = { foo: 'bar' };
    it.each`
      option            | value
      ${'mode'}         | ${'production'}
      ${'target'}       | ${'node'}
      ${'devtool'}      | ${'source-map'}
      ${'node'}         | ${testObject}
      ${'entry'}        | ${testObject}
      ${'serve'}        | ${testObject}
      ${'stats'}        | ${testObject}
      ${'watch'}        | ${testObject}
      ${'output'}       | ${testObject}
      ${'plugins'}      | ${testObject}
      ${'resolve'}      | ${testObject}
      ${'externals'}    | ${testObject}
      ${'devServer'}    | ${testObject}
      ${'experiments'}  | ${testObject}
      ${'performance'}  | ${testObject}
      ${'optimization'} | ${testObject}
      ${'watchOptions'} | ${testObject}
    `('User can update $option', ({ option, value }) => {
      const config = makeWebpackConfig({ [option]: value });
      expect(config[option]).toBe(value);
    });
  });
});

describe('makeJS', () => {
  const DEFAULT_JS_USE_LENGTH = 1;
  const customPresets = ['@babel/some-preset'];
  const customPlugins = ['@babel/some-plugin'];

  it('Has babel-loader as default config', () => {
    const js = makeJS();
    expect(js.use.length).toBe(DEFAULT_JS_USE_LENGTH);
    expect(js.use.some(rule => rule.loader === 'babel-loader')).toBe(true);
  });

  it('Default JS test handles .js and .jsx', () => {
    const { test } = makeJS();
    expect(test.test('.js')).toBe(true);
    expect(test.test('.jsx')).toBe(true);
  });

  it('User can add to `use` array', () => {
    const js = makeJS({ use: [...defaultJSUse, ...customUse] });
    expect(js.use.length).toBe(DEFAULT_JS_USE_LENGTH + 1);
    expect(js.use).toEqual([...defaultJSUse, ...customUse]);
  });

  it('User can overwrite `use` array', () => {
    const js = makeJS({ use: customUse });
    expect(js.use.length).toBe(1);
    expect(js.use).toEqual(customUse);
  });

  describe('Babel presets', () => {
    it('User can add to default babel presets', () => {
      const customPresetsWithDefaults = [...defaultBabelPresets, ...customPresets];
      const js = makeJS({ babelPresets: customPresetsWithDefaults });
      const babelLoader = js.use.find(use => use.loader === 'babel-loader');
      expect(babelLoader.options.presets).toEqual(customPresetsWithDefaults);
      expect(babelLoader.options.plugins).toEqual(defaultBabelPlugins);
    });

    it('User can overwrite default babel presets', () => {
      const js = makeJS({ babelPresets: customPresets });
      const babelLoader = js.use.find(use => use.loader === 'babel-loader');
      expect(babelLoader.options.presets.length).toBe(1);
      expect(babelLoader.options.presets).toEqual(customPresets);
      expect(babelLoader.options.plugins).toEqual(defaultBabelPlugins);
    });

    it('Throws if babel presets are provided and babel-loader is not found', () => {
      expect(() =>
        makeJS({
          babelPresets: customPresets,
          use: [{ loader: 'bubble-loader' }],
        })
      ).toThrow('Babel options provided but no Babel loader found');
    });
  });

  describe('Babel plugins', () => {
    it('User can add to default babel plugins', () => {
      const customPluginsWithDefaults = [...defaultBabelPlugins, ...customPlugins];
      const js = makeJS({ babelPlugins: customPluginsWithDefaults });
      const babelLoader = js.use.find(use => use.loader === 'babel-loader');
      expect(babelLoader.options.plugins).toEqual(customPluginsWithDefaults);
      expect(babelLoader.options.presets).toEqual(defaultBabelPresets);
    });

    it('User can overwrite default babel plugins', () => {
      const js = makeJS({ babelPlugins: customPlugins });
      const babelLoader = js.use.find(use => use.loader === 'babel-loader');
      expect(babelLoader.options.plugins.length).toBe(1);
      expect(babelLoader.options.plugins).toEqual(customPlugins);
      expect(babelLoader.options.presets).toEqual(defaultBabelPresets);
    });

    it('Throws if babel plugins are provided and babel-loader is not found', () => {
      expect(() =>
        makeJS({
          babelPlugins: customPlugins,
          use: [{ loader: 'bubble-loader' }],
        })
      ).toThrow('Babel options provided but no Babel loader found');
    });
  });

  describe('Exclude array', () => {
    it('User can add to default `exclude` array', () => {
      const customExclude = [...defaultJSExclude, /\.test.js$/];
      const js = makeJS({ exclude: customExclude });
      expect(js.exclude.length).toBe(DEFAULT_EXCLUDE_LENGTH + 1);
      expect(js.exclude).toEqual(customExclude);
    });

    it('User can overwrite default `exclude` array', () => {
      const customExclude = [/\.test.js$/];
      const js = makeJS({ exclude: customExclude });
      expect(js.exclude.length).toBe(1);
      expect(js.exclude).toEqual(customExclude);
    });
  });
});

describe('makeCSS', () => {
  it('Uses style-loader, css-loader, and sass-loader by default', () => {
    const css = makeCSS();
    expect(css.use.length).toBe(3);
    expect(css.use.some(rule => rule.loader === 'style-loader')).toBe(true);
    expect(css.use.some(rule => rule.loader === 'css-loader')).toBe(true);
    expect(css.use.some(rule => rule.loader === 'sass-loader')).toBe(true);
  });

  it('Default CSS test handles .css and .scss', () => {
    const css = makeCSS();
    expect(css.test.test('.css')).toBe(true);
    expect(css.test.test('.scss')).toBe(true);
  });

  it('css loader has `modules: true` by default', () => {
    const css = makeCSS();
    const cssLoader = css.use.find(loader => loader.loader === 'css-loader');
    expect(cssLoader.options.modules).toBe(true);
  });

  it('User can add to `use` array', () => {
    const customUseWithDefault = [...defaultCSSUse, { loader: 'other-css-loader' }];
    const css = makeCSS({ use: customUseWithDefault });
    expect(css.use).toEqual(customUseWithDefault);
  });

  it('User can overwrite `use` array', () => {
    const customUse = [{ loader: 'other-css-loader' }];
    const css = makeCSS({ use: customUse });
    expect(css.use).toEqual(customUse);
  });

  it('user can overwrite css-loader options', () => {
    const css = makeCSS({ cssLoaderOptions: { modules: false } });
    const cssLoader = css.use.find(({ loader }) => loader === 'css-loader');
    expect(cssLoader.options).toEqual({ modules: false });
    // Make sure sass-loader options are unchanged
    const sassLoader = css.use.find(({ loader }) => loader === 'sass-loader');
    expect(sassLoader.options).toBeUndefined();
  });

  it('user can merge css-loader options', () => {
    const css = makeCSS({ cssLoaderOptions: { foo: false } });
    const cssLoader = css.use.find(({ loader }) => loader === 'css-loader');
    expect(cssLoader.options).toEqual({ modules: true, foo: false });
    // Make sure sass-loader options are unchanged
    const sassLoader = css.use.find(({ loader }) => loader === 'sass-loader');
    expect(sassLoader.options).toBeUndefined();
  });

  it('user can overwrite sass-loader options', () => {
    const css = makeCSS({ sassLoaderOptions: { foo: 'bar' } });
    // Make sure sass-loader options are unchanged
    const cssLoader = css.use.find(({ loader }) => loader === 'css-loader');
    expect(cssLoader.options).toEqual(defaultCSSLoaderOptions);
    const sassLoader = css.use.find(({ loader }) => loader === 'sass-loader');
    expect(sassLoader.options).toEqual({ foo: 'bar' });
  });

  it('throws if CSS options with no CSS loader', () => {
    const options = { use: [], cssLoaderOptions: { foo: true } };
    expect(() => makeCSS(options)).toThrow('CSS loader options provided but no CSS loader found');
  });

  it('throws if SASS options with no SASS loader', () => {
    const options = { use: [], sassLoaderOptions: { foo: true } };
    expect(() => makeCSS(options)).toThrow('SASS loader options provided but no SASS loader found');
  });
});

describe('makeTS', () => {
  it('basic TS config', () => {
    expect(makeTS()).toEqual({
      test: /\.tsx?$/,
      exclude: [/node_modules/],
      use: [{ loader: 'ts-loader' }],
    });
  });

  it('user can override exclude and use', () => {
    expect(makeTS({ exclude: [/other-dir/], use: [{ foo: 'bar' }] })).toEqual({
      test: /\.tsx?$/,
      exclude: [/other-dir/],
      use: [{ foo: 'bar' }],
    });
  });
});
