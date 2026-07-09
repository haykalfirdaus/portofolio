const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'security-shield': './src/security-shield.js',
    'encoding-utils': './src/encoding-utils.js',
    'modules': './src/modules-obfuscated.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: '[name].min.js',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== "undefined" ? self : this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'last 2 versions' }]]
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            passes: 3,
            drop_console: true,
            pure_funcs: ['console.log', 'console.warn', 'console.error'],
            unsafe: true,
            unsafe_methods: true,
            unsafe_proto: true
          },
          mangle: {
            properties: false,
            keep_fnames: false,
            keep_classnames: false
          },
          output: {
            beautify: false,
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },
  devtool: false,
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
