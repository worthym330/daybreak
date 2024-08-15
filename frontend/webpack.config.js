const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'development';

  return {
    entry: './src/index.js', // Entry point for your application
    output: {
      path: path.resolve(__dirname, 'dist'), // Output directory
      filename: isProduction ? '[name].[contenthash].js' : '[name].js', // Output file name pattern
    },
    module: {
      rules: [
        // JavaScript/JSX files
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        // CSS files
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        // Image files
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]',
          },
        },
        // Video files
        {
          test: /\.(mp4|webm|ogg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'videos/[name].[hash][ext]',
          },
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(), // Minify JavaScript
        new CssMinimizerPlugin(), // Minify CSS
      ],
      splitChunks: {
        chunks: 'all', // Split vendor code into separate chunks
      },
    },
    plugins: [
      new CleanWebpackPlugin(), // Clean the output directory before each build
      new HtmlWebpackPlugin({
        template: './src/index.html', // Template for generating the HTML file
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
            }
          : false,
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      }),
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map', // Source maps for debugging
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000, // Development server port
      open: true, // Automatically open the browser
      hot: true, // Enable hot module replacement
    },
  };
};
