var webpack = require('webpack');
var path = require('path');
//var nodeExternals = require('webpack-node-externals');

var BUILD_DIR = path.resolve(__dirname, './build');
var APP_DIR = path.resolve(__dirname, './src/');




const config = {

  // target: 'node',
  externals: ['tslint'], 

  resolve: {
     extensions: ['.js', '.jsx']
  },

  devtool: "source-map",

  watchOptions: {
    aggregateTimeout: 500,
    poll: 200
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
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react' ], // Transpiles JSX and ES6
            plugins: ['@babel/plugin-transform-arrow-functions', '@babel/plugin-proposal-class-properties']
          }
        }]
      },
      {
        test: /(\.css)$/,
        use: [
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              require('tailwindcss'),
              require('autoprefixer'),
            ],
          },
        }] 
      },

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
     

  ],
  }
};

module.exports = config;
