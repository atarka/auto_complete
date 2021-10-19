const { resolve } = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  target: 'web',
  context: resolve(__dirname, 'src'),
  entry: {
    app: './index.js',
  },
  output: {
    globalObject: "this",
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
    publicPath: './'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      inject: 'body',
      minify: false,
      template: "./index.ejs",
      filename: "./index.html"
    })
  ],
};
