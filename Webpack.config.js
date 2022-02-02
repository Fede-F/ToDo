const path = require('path');

//Configuraciones para HTML
const HTMLWebpackPlugin = require('html-webpack-plugin');
const indextInput = './src/index.html';
const indexOutput = 'index.html';

module.exports = {
  entry: './src/JS/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: indexOutput,
      template: indextInput,
    })
  ]
};
