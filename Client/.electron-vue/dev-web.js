'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseMainConfig = require('./webpack.web.config')

module.exports = merge(baseMainConfig, {
  devServer: {
    port: 8080,
    hot: true,
    contentBase: path.join(__dirname, "../dist"), // since we use CopyWebpackPlugin.
    overlay: {
      errors: true
    }
  }
})
