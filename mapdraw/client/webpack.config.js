var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './build');
var APP_DIR = path.resolve(__dirname, './src/');


const config = {

  // target: 'node',
  externals: ['tslint'], 

  resolve: {
   extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  devtool: "source-map",

  watchOptions: {
    aggregateTimeout: 500,
    poll: 200
  },
  mode: 'development',
  entry: {
     main: APP_DIR + '/App.tsx'
  },
  output: {
    filename: 'bundle.js',
    path: BUILD_DIR,
  },

  module: {

    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react' ], // Transpiles JSX and ES6
            //plugins: ['@babel/plugin-transform-arrow-functions', '@babel/plugin-proposal-class-properties']
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
  ],
  }
};

module.exports = config;
