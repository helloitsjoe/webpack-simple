const {
  makeWebpackConfig,
  defaultWebpackRules,
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
  xit('Has babel-loader as default config', () => {});
  xit('Default JS test handles .js and .jsx', () => {});
  xit('User can add to `use` array', () => {});
  xit('User can overwrite `use` array', () => {});
  xit('User can add to default babel presets', () => {});
  xit('User can overwrite default babel presets', () => {});
  xit('User can add to default babel plugins', () => {});
  xit('User can overwrite default babel plugins', () => {});
  xit('User can add to default `exclude` array', () => {});
  xit('User can overwrite default `exclude` array', () => {});
});

describe('makeCSS', () => {
  xit('Uses style-loader, css-loader, and sass-loader by default', () => {});
  xit('Default CSS test handles .css and .scss', () => {});
  xit('User can add to `use` array', () => {});
  xit('User can overwrite `use` array', () => {});
  xit('css and sass loaders have `modules: true` by default', () => {});
  xit('user can overwrite css-loader options', () => {});
  xit('user can merge css-loader options', () => {});
  xit('user can overwrite sass-loader options', () => {});
  xit('user can merge sass-loader options', () => {});
});
