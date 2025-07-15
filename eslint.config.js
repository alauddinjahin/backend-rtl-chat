// eslint.config.js
const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js', '!tests/e2e/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        // Node.js core
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        // Common built-ins
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      indent: ['error', 2],
      //   quotes: ['error', 'single'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      eqeqeq: 'error',
      'no-duplicate-imports': 'error',
      'no-trailing-spaces': 'error',
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'padded-blocks': ['error', 'never']
    }
  },
  {
    files: ['tests/e2e/**/*.js', 'tests/e2e/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly', // if you declare here no need to import top of the file manually
        require: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-redeclare': 'error',
      //   'no-redeclare': ['error', { builtinGlobals: false }],
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['tests/**/*.js', '!tests/e2e/**/*.js', '!tests/e2e/*.js'],
    rules: {
      'no-console': 'off',
      'no-unused-expressions': 'off'
    },
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        require: 'readonly',
        testUtils: 'readonly',
        global: 'readonly',
        jest: 'readonly'
      }
    }
  },
  {
    ignores: [
      'node_modules',
      'coverage',
      'logs',
      'test-results',
      'playwright-report',
      '*.config.*',
      'utils/swagger'
    ]
  },
  prettier
];
