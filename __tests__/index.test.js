const {
  makeWebpackConfig,
  defaultWebpackRules,
  defaultBabelPlugins,
  defaultBabelPresets,
  defaultJSUse,
  makeJS,
  makeCSS,
} = require('../index');

const DEFAULT_RULES_LENGTH = 2;

describe('makeWebpackConfig', () => {
  const config = makeWebpackConfig();
  const newRules = [{ test: /\.js$/, use: [{ loader: 'other-loader' }] }];

  it.each`
    key          | value
    ${'mode'}    | ${'development'}
    ${'target'}  | ${'web'}
    ${'entry'}   | ${undefined}
    ${'output'}  | ${undefined}
    ${'devtool'} | ${undefined}
  `('$key is $value by default', ({ key, value }) => {
    expect(config[key]).toBe(value);
  });

  it('Rules include js and css by default', () => {
    expect(config.module.rules.length).toBe(DEFAULT_RULES_LENGTH);
    expect(config.module.rules[0]).toEqual(makeJS());
    expect(config.module.rules[1]).toEqual(makeCSS());
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
});

describe('makeJS', () => {
  const DEFAULT_JS_USE_LENGTH = 1;
  const customUse = [{ loader: 'other-loader', options: { foo: 'bar' } }];
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
      const customPresetsWithDefaults = [
        ...defaultBabelPresets,
        ...customPresets,
      ];
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
      const customPluginsWithDefaults = [
        ...defaultBabelPlugins,
        ...customPlugins,
      ];
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
    it('User can add to default `exclude` array', () => {});
    it('User can overwrite default `exclude` array', () => {});
  });
});

describe('makeCSS', () => {
  it('Uses style-loader, css-loader, and sass-loader by default', () => {});
  it('Default CSS test handles .css and .scss', () => {});
  it('User can add to `use` array', () => {});
  it('User can overwrite `use` array', () => {});
  it('css and sass loaders have `modules: true` by default', () => {});
  it('user can overwrite css-loader options', () => {});
  it('user can merge css-loader options', () => {});
  it('user can overwrite sass-loader options', () => {});
  it('user can merge sass-loader options', () => {});
});
