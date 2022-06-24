const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  // devtool: 'none',
  plugins: [
    // 清除文件
    new CleanWebpackPlugin(),
    // 打包分析
    new BundleAnalyzerPlugin({
      analyzerMode: 'server', // 开一个本地服务查看报告
      analyzerHost: '127.0.0.1', // host 设置
      analyzerPort: 8888, // 端口号设置
    }),
  ],
})
