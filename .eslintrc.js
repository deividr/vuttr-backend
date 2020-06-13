module.exports = {
  extends: [
    'standard-with-typescript',
    'prettier/standard',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        name: 'never',
        asyncArrow: 'always',
      },
    ],
  },
}
