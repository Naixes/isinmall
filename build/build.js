// 构建生产版本
'use strict'
require('./check-versions')()

// 全局的环境变量设置：生产版本
process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
// webpack生产包的配置
const webpackConfig = require('./webpack.prod.conf')

// 日志输出
const spinner = ora('building for production...')
// loading
spinner.start()

// 删除前一次打包的文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  // 通过函数插件打包
  webpack(webpackConfig, (err, stats) => {

    // 停止
    spinner.stop()
    if (err) throw err
    // 输出颜色和模式
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }
    // 打包成功
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
