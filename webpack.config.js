const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

dotenv.config();

var package = require('./package.json');

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = {
  entry: [
    'babel-polyfill',
    'index.tsx'
  ],
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js', '.jsx', '.less', '.json'
    ],
    modules: ['./src', './node_modules']
  },
  output: {
      path: __dirname + '/dist',
      filename: 'index.js'
  },
  devtool: 'source-map',
  target: 'node-webkit',
  module: {
    loaders: [
      {
        test: /\.less$/,
        include: __dirname + '/src',
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader"
          }, {
              loader: "less-loader"
          }]
        })
      },
      {
        test: /\.tsx?$/,
        include: __dirname + '/src',
        loader: [{
          loader: 'babel-loader',
          options: {
            presets: ["es2017", "stage-0", "react"] 
          }
        }, {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "styles.css",
      disable: process.env.NODE_ENV === "development"
    }),
    new CopyWebpackPlugin([{
      from: './public'
    }]),
    new CopyWebpackPlugin([{
      from: './package.json'
    }]),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
      PROD: JSON.stringify('production'),
      DEV: JSON.stringify('development'),
      API_URL: JSON.stringify(process.env.API_URL),
      API_VERSION: JSON.stringify('v1'),
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')      
    })
  ]
};