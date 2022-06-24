const path = require('path')

// path.resolve: 可以将路径或者路径片段解析成绝对路径。
// __dirname: 总是指向被执行 js 文件的绝对路径
const PROJECT_PATH = path.resolve(__dirname, '../')
const PROJECT_NAME = path.parse(PROJECT_PATH).name

const isDev = process.env.NODE_ENV !== 'production'

const SERVER_HOST = '127.0.0.1'
const SERVER_PORT = 9000

module.exports = {
  PROJECT_PATH,
  PROJECT_NAME,
  isDev,
  SERVER_HOST,
  SERVER_PORT,
}
