const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv').config().parsed;

const mode = dotenv.MODE || 'development';

module.exports = {
  mode,
  entry: './src/main.ts',
  devtool: mode === 'development' ? 'inline-source-map' : false,
  devServer: {
    static: './dist',
    hot: true,
    open: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: {
      name: 'SimpleMindDrawer',
      type: 'umd',
    },
    globalObject: 'this',
  },
};
