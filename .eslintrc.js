// 解决代码质量问题
// 它能在我们编写代码时就检测出程序可能出现的隐性BUG
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'standard',
    'prettier',
    // prettier和eslint冲突解决
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        // 一行最多100字符，超过换行
        printWidth: 100,
        // 行尾不用分号
        semi: false,
        // 使用单引号
        singleQuote: true,
      },
    ],
    'no-use-before-define': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 0,

    'react/prop-types': 0,
  },
  ignorePatterns: ['!.*.js'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      },
      typescript: {},
    },
  },
}
