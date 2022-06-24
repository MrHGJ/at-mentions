// 检查git commit 时的 message 格式是否符合规
// commitlint.config.js或者.commitlintrc.js

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新特性，需求
        'fix', // 修正bug和功能
        'docs', // 文档
        'style', // 格式（不影响代码运行的变动)
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'anno', // 增加注释
      ],
    ],
    // 关闭 停止位 校验
    'subject-full-stop': [0, 'never'],
    // 关闭 subject 大小写检查
    'subject-case': [0, 'never'],
    // 关闭 scope 大小写检查
    'scope-case': [0, 'never'],
  },
}
