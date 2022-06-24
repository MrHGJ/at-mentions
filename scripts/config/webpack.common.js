const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { isDev, PROJECT_PATH } = require('../constants')

const getCssLoaders = (importLoaders) => [
  'style-loader',
  // css样式处理
  {
    loader: 'css-loader',
    options: {
      modules: false, // 默认就是 false, 若要开启，可在官网具体查看可配置项
      sourceMap: isDev, // 开启后与 devtool 设置一致, 开发环境开启，生产环境关闭
      importLoaders, // 指定在 CSS loader 处理前使用的 loader 数量
    },
  },
  // css浏览器兼容处理
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [
        // 修复一些和 flex 布局相关的 bug
        // require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            grid: true,
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
        // require('postcss-normalize'),
      ],
      sourceMap: isDev,
    },
  },
]

module.exports = {
  // 定义了入口文件路径，其属性名 app 表示引入文件的名字。
  entry: {
    app: path.resolve(PROJECT_PATH, './src/index.tsx'),
  },
  // 定义了编译打包之后的文件名以及所在路径。
  output: {
    filename: `js/[name]${isDev ? '' : '.[hash:8]'}.js`,
    // path.resolve: 可以将路径或者路径片段解析成绝对路径。
    path: path.resolve(PROJECT_PATH, './dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(PROJECT_PATH, './src'),
    },
  },
  // 压缩js代码
  optimization: {
    minimize: !isDev,
    minimizer: [
      !isDev &&
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: { pure_funcs: ['console.log'] },
          },
        }),
      // terser
      !isDev && new OptimizeCssAssetsPlugin(),
    ].filter(Boolean),
    splitChunks: {
      // ...
    },
  },
  module: {
    rules: [
      // jsx处理
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      // css样式文件处理
      {
        test: /\.css$/,
        use: getCssLoaders(1),
      },
      // scss样式文件处理
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      // 图片处理
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              // 如果你这个图片文件大于10kb，那url-loader就不用，转而去使用file-loader，把图片正常打包成一个单独的图片文件到设置的目录下.
              // 若是小于10kb，就将图片打包成base64的图片格式插入到打包之后的文件中，这样做的好处是，减少了http请求，但是如果文件过大，js文件也会过大，得不偿失.
              limit: 10 * 1024,
              // 输出的文件名为原来的文件名.哈希值.后缀 ，有了这个hash值，可防止图片更换后导致的缓存问题。
              name: '[name].[contenthash:8].[ext]',
              // 输出到dist目录下的路径，即图片目录 dist/assets/images
              outputPath: 'assets/images',
            },
          },
        ],
      },
      // 文字处理
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/fonts',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 生成html文件
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './src/index.html'),
      filename: 'index.html',
      cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
      minify: isDev
        ? false
        : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            useShortDoctype: true,
          },
    }),
    // 拷贝公共静态资源
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(PROJECT_PATH, './static'),
          from: '*',
          to: path.resolve(PROJECT_PATH, './dist/static'),
          toType: 'dir',
        },
      ],
    }),
    // 显示编译速度
    new WebpackBar({
      name: isDev ? '正在启动' : '正在打包',
      color: '#fa8c16',
    }),
  ],
}
