const { target, env } = require('./target.cjs');

function BestShot() {
  try {
    // eslint-disable-next-line node/no-missing-require
    require.resolve('@best-shot/preset-env/package.json');
    // @ts-ignore
    // eslint-disable-next-line global-require, import/no-unresolved, node/no-missing-require
    return require('@best-shot/preset-env/eslint.js').globals;
    // eslint-disable-next-line no-empty
  } catch {}
}

// eslint-disable-next-line consistent-return
function webpack() {
  try {
    // eslint-disable-next-line node/no-missing-require
    require.resolve('webpack/package.json');
    return {
      __webpack_public_path__: 'readonly',
      __resourceQuery: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
    };
    // eslint-disable-next-line no-empty
  } catch {}
}

module.exports = {
  parserOptions: {
    ecmaVersion: target,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      globalReturn: false,
      jsx: false,
    },
  },
  env: {
    browser: true,
    [env]: true,
    // not node.js
    commonjs: false,
    node: false,
  },
  rules: {
    'array-callback-return': [
      'error',
      { allowImplicit: true, checkForEach: true },
    ],
    'no-console': 'off',
    'no-nested-ternary': 'off',
    'no-template-curly-in-string': 'off',
    camelcase: 'off',
  },
  overrides: [
    {
      files: 'src/**',
      globals: {
        ...webpack(),
        ...BestShot(),
      },
    },
    {
      // for node.js
      files: '*.cjs',
      extends: require.resolve('./node.cjs'),
    },
    {
      // for node.js
      files: '*.mjs',
      extends: require.resolve('./node.cjs'),
      env: {
        commonjs: false,
      },
      rules: {
        'node/no-unsupported-features/es-syntax': [
          'error',
          { ignores: ['modules'] },
        ],
      },
    },
  ],
};