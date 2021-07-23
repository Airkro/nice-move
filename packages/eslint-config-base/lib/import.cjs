'use strict';

const { join } = require('path');

const { pkgHas, configHas } = require('./utils.cjs');

const Vscode = pkgHas(
  ({ engines: { vscode } = {} }) => vscode,
  () => ({ 'import/core-modules': ['vscode'] }),
);

module.exports = {
  extends: ['plugin:import/recommended'],
  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        ignorePackages: true,
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.{test,spec}.{m,c,}js',
          '{test,tests,try}.{m,c,}js',
          '{test,tests,config}/**/*.{m,c,}js',
          '**/.*rc.{m,c,}js',
          '**/*.config.{m,c,}js',
          '.best-shot/**',
        ],
      },
    ],
    'import/newline-after-import': 'off',
    'import/no-dynamic-require': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
  },
  settings: {
    ...Vscode,
    'import/ignore': false,
    ...configHas(
      ({ 'internal-regex': internalRegex }) => internalRegex,
      (internalRegex) => ({ 'import/internal-regex': internalRegex }),
    ),
  },
  overrides: [
    pkgHas(
      ({ workspaces }) =>
        workspaces && (workspaces.packages || workspaces).length > 0,
      (_, { workspaces }) => ({
        files: (workspaces.packages || workspaces).map((item) =>
          join(item, '*'),
        ),
        rules: {
          'import/no-relative-packages': 'warn',
        },
        settings: {
          'import/internal-regex': false,
        },
      }),
    ),
    {
      files: '*.cjs',
      settings: {
        'import/extensions': ['.cjs', '.js', '.json'],
        'import/resolver': {
          node: {
            extensions: ['.cjs', '.js', '.json'],
          },
        },
      },
    },
    {
      files: '*.mjs',
      settings: {
        'import/extensions': ['.mjs', '.cjs', '.js'],
        'import/resolver': {
          node: {
            extensions: ['.mjs', '.cjs', '.js'],
          },
        },
      },
    },
    {
      files: '**/*',
      excludedFiles: ['*.cjs'],
      rules: {
        'import/no-commonjs': 'error',
      },
    },
    {
      files: '**/*.*',
      excludedFiles: '*.{m,c}js',
      rules: {
        'import/no-nodejs-modules': 'error',
      },
      settings: {
        'import/extensions': ['.js', '.js', '.js'],
        'import/resolver': {
          node: {
            extensions: ['.js', '.js', '.js'],
          },
        },
      },
    },
  ].filter(Boolean),
};
