var lib = 'dashboard/static/js/libs';
var js = 'dashboard/static/js';
var webpack = require("webpack");
var ProvidePlugin = require('webpack').ProvidePlugin;
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = {
  entry: {
    app:'./dashboard/static/js/main.js',
    vendor:['jquery', 'backbone', 'font-awesome-webpack'],
  }, 
  output: {
    path: './dashboard/build',
    publicPath: "http://localhost:9876",
    filename: 'bundle.js'
  },
  plugins: [
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": 'jquery',
            "windows.jQuery": 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new ExtractTextPlugin('bundle.css')
    ],
  resolve: {
  // modulesDirectories: [lib],
   extensions: ['', '.js'],

 },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.(png|eot|svg|ttf|woff|woff2)$/, loader: 'url-loader?limit=100000' }
    ]
  }
 
};

module.exports = config;