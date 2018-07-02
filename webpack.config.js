/* eslint-disable import/no-commonjs, fp/no-mutation */
// const R = require('ramda')
const nodeExternals = require('webpack-node-externals')
const path = require('path')

const libraryName = 'rematchDefaultReducers'
const filename = 'rematch-default-reducers'
const isDev = process.env.NODE_ENV !== 'production'

const baseConfig = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : 'none',
  entry: './src/index.js',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? filename + '.js' : filename + '.min.js',
    libraryTarget: 'umd',
    library: libraryName,
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}

// const nodeConfig = R.merge(baseConfig)({
//   output: {filename: '[name].node.js'},
//   target: 'node',
// })
// const browserConfig = R.merge(baseConfig)({
//   output: {filename: '[name].js'},
//   target: 'web',
// })

// module.exports = [nodeConfig, browserConfig]
module.exports = baseConfig
