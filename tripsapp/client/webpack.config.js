var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './build');
var APP_DIR = path.resolve(__dirname, './src/');

const config = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 300
  },
   mode: 'development',
   entry: {
     main: APP_DIR + '/App.js'
   },
   output: {
     filename: 'bundle.js',
     path: BUILD_DIR,
   },
   module: {
    rules: [
     {
       test: /(\.css|.scss)$/,
       use: [{
           loader: "style-loader" // creates style nodes from JS strings
       }, {
           loader: "css-loader" // translates CSS into CommonJS
       }, {
           loader: "sass-loader" // compiles Sass to CSS
       }]
     },
     {
       test: /\.(jsx|js)?$/,
       use: [{
         loader: "babel-loader",
         options: {
           cacheDirectory: true,
           presets: ['@babel/preset-env', '@babel/preset-react' ], // Transpiles JSX and ES6
           plugins: ['@babel/plugin-transform-arrow-functions', '@babel/plugin-proposal-class-properties']
         }
       }]
     }
    ],

  }
};

module.exports = config;
