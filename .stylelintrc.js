// 统一样式代码风格
module.exports = {
  // 引入标准配置文件和scss配置扩展
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-recess-order',
    // stylelint和prettier冲突解决
    'stylelint-config-prettier',
  ],
  rules: {
    // 引号必须为单引号
    'string-quotes': ['single'],
    // 冒号后要加空格
    'declaration-colon-space-after': ['always'],
    // 冒号前不加空格
    'declaration-colon-space-before': ['never'],
    // 变量后必须添加!default，本地局部变量可以不加
    'scss/dollar-variable-default': [true, { ignore: 'local' }],
    // 属性单独成行
    'declaration-block-single-line-max-declarations': [1],
    // 属性和值前不带厂商标记（通过autofixer自动添加，不要自己手工写）
    'property-no-vendor-prefix': [true],
    'value-no-vendor-prefix': [true],
    // 多选择器必须单独成行，逗号结尾
    'selector-list-comma-newline-after': ['always'],
    // 不能有无效的16进制颜色值
    'color-no-invalid-hex': [true],
    // https://stylelint.io/user-guide/rules/no-descending-specificity
    'no-descending-specificity': null,
  },
  ignoreFiles: ['**/*.ts', '**/*.tsx', '**/*.jsx', '**/*.js'],
}
