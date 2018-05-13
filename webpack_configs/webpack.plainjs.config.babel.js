import { resolve } from 'path'
import { HotModuleReplacementPlugin } from 'webpack'
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const CONFIG = {
  entry: {
    app: resolve('./examples/example_plain_js/index.js')
  },
  devtool: 'source-maps',
  output: {
    path: resolve('./examples/example_plain_js/dist'),
    filename: 'gigaGraph.bundle.js',
    library: 'gigaGraph',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'buble-loader',
        include: [resolve('.')],
        exclude: [/node_modules/],
        options: {
          objectAssign: 'Object.assign'
        }
      }
    ]
  },
  plugins: [new HotModuleReplacementPlugin()]
}

// This line enables bundling against src in this repo rather than installed deck.gl module
export default function (env) { return (env ? require('../webpack.config.local')(CONFIG)(env) : CONFIG) }
