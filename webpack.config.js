const path = require('path')
const PACKAGE = require('./package.json')

const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: 'development',
  entry: {
    game_physics: './src/index.js'
  },
  devServer: {
    contentBase: './dist'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './src/[name].[contenthash].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|mp3|ttf|eot|woff|svg)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'The Last Ninja',
      template: './public/index.html',
      favicon: './public/favicon.ico',
      version: PACKAGE.version
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/assets", to: "assets" }
      ]
    })
  ],
}