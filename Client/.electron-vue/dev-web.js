'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseMainConfig = require('./webpack.web.config')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

module.exports = merge(baseMainConfig, {
  devServer: {
    port: 8080,
    hot: true,
    contentBase: path.join(__dirname, "../dist"), // since we use CopyWebpackPlugin.
  }
})
