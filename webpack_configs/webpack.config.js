import { resolve } from 'path'
import { HotModuleReplacementPlugin } from 'webpack'
// import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

const CONFIG = {
  entry: {
    app: resolve('./python-frontend.js')
  },
  devtool: 'source-maps',
  output: {
    path: resolve('./dist'),
    filename: 'bundle.js'
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
