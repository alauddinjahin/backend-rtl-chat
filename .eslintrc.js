
// module.exports = {
//   env: {
//     node: true,
//     es2021: true,
//     jest: true
//   },
//   extends: ['eslint:recommended'],
//   parserOptions: {
//     ecmaVersion: 'latest',
//     sourceType: 'module'
//   },
//   rules: {
//     'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
//     'no-var': 'error',
//     'prefer-const': 'error',
//     'indent': ['error', 2],
//     'quotes': ['error', 'single'],
//     'semi': ['error', 'always'],
//     'comma-dangle': ['error', 'never'],
//     'object-curly-spacing': ['error', 'always'],
//     'eqeqeq': 'error',
//     'no-duplicate-imports': 'error',
//     'no-trailing-spaces': 'error',
//     'space-before-blocks': 'error'
//   },
//   overrides: [
//     {
//       files: ['tests/**/*.js'],
//       rules: { 'no-console': 'off' }
//     }
//   ]
// };


module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'eqeqeq': 'error',
    'no-duplicate-imports': 'error',
    'no-trailing-spaces': 'error',
    'space-before-blocks': 'error',
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'padded-blocks': ['error', 'never']
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: { 
        'no-console': 'off',
        'no-unused-expressions': 'off'
      },
      globals: {
        'describe': 'readonly',
        'it': 'readonly',
        'test': 'readonly',
        'expect': 'readonly',
        'beforeEach': 'readonly',
        'afterEach': 'readonly',
        'beforeAll': 'readonly',
        'afterAll': 'readonly'
      }
    }
  ]
};