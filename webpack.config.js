const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor'
  }),
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  }),
  new ExtractTextPlugin("[name].css"),
  new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false},
    output: {comments: false},
    sourceMap: true
  }),
  new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop')
]

module.exports = {
  devtool: 'source-map',
  entry: {
    vendor: './src/vendors.js',
    main: './src/client.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map'
  },
  resolve: {
    extensions: ['*', '.js']
  },
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_module/,
        loader: 'standard-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "postcss-loader"
          }],
          fallback: "style-loader"
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015','stage-0'],
          plugins: [
            ["transform-runtime", {
              "helpers": false, // defaults to true
              "polyfill": false, // defaults to true
              "regenerator": true, // defaults to true
              "moduleName": "babel-runtime" // defaults to "babel-runtime"
            }]
          ]
        }
      }
    ]
  },
  plugins: plugins,
  node: {
    fs: "empty",
    net: 'empty',
    tls: 'empty'
  }
}
