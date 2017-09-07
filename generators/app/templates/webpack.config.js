const webpack = require('webpack');
const clean = require('clean-webpack-plugin');
const copy = require('copy-webpack-plugin');
const analyze = require('webpack-bundle-analyzer/lib/BundleAnalyzerPlugin');
const extract = require('extract-text-webpack-plugin');
const html = require('html-webpack-plugin');
const dotenv = require('dotenv');
const _ = require('lodash');
require('pathify-string');
const package = require('./package');

dotenv.load();

const isDev = (process.env.npm_lifecycle_script || process.argv.join()).includes('webpack-dev-server');
const isProd = !isDev;

module.exports = {
  context: __dirname.join('src'),
  entry: {
    app: [
      isProd && 'babel-polyfill',
      '.'
    ].filter(Boolean)
  },
  output: {
    filename: isDev ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: 'chunks/[name].[chunkhash].js',
    path: __dirname.join('build'),
    sourceMapFilename: '[file].map',
    hashDigestLength: 5
  },
  devtool: isDev ? 'cheap-module-source-map' : 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      include: __dirname.join('src'),
      use: [
        isDev && 'webpack-module-hot-accept',
        isProd && { loader: 'babel-loader', options: { retainLines: true } },
      ].filter(Boolean)
    }, {
      test: /\.css$/,
      use: extract.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: true
          }
        }]
      })
    }, {
      test: /\.styl$/,
      use: extract.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[local]_[hash:base64:5]',
            camelCase: true,
            minimize: true,
            sourceMap: true
          }
        }, 'stylus-loader']
      })
    }, {
      test: /\.(png|jpe?g|woff|woff2|eot|ttf|svg|pdf|mp3|docx)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: {
        loader: 'url-loader',
        query: {
          limit: 1000,
          name: isDev
            ? '[path][name].[ext]'
            : 'assets/[name]-[hash:base64:5].[ext]'
        }
      }
    }, {
      test: /\.(txt)$/,
      use: 'text-loader'
    }]
  },
  plugins: [
    isProd && new clean(['build']),
    new extract({
      filename: '[name].[chunkhash].css',
      disable: isDev,
      // disable: true,
    }),
    isDev && new webpack.NamedModulesPlugin() || new webpack.HashedModuleIdsPlugin(),
    isProd && new webpack.optimize.CommonsChunkPlugin({
      name: 'node_modules',
      minChunks: module => module.context.includes('node_modules')
    }),
    isProd && new webpack.optimize.CommonsChunkPlugin({
      name: 'webpack'
    }),
    new html({
      template: 'index.html',
      title: _.startCase(package.name),
      appMountId: 'app',
      links: ['https://cdnjs.cloudflare.com/ajax/libs/css-spinning-spinners/1.1.1/load8.css'],
    }),
    isProd && new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: false,
      comments: false,
      output: {
        ascii_only: true
      }
    }),
    isProd && new analyze({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      'create-react-class': 'preact-compat/lib/create-react-class'
    }
  },
  stats: 'errors-only',
  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT,
    disableHostCheck: true,
    historyApiFallback: true,
    stats: 'errors-only',
  }
};
