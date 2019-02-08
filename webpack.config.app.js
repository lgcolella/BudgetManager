const path = require('path');
const outputPath = 'build';
const webpack = require('webpack');

module.exports = {

    target: 'electron-renderer',
    entry: {
        'app': path.resolve(__dirname, 'src/app/app.js'),
        'vendor': path.resolve(__dirname, 'src/app/vendor.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, outputPath, 'app')
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              presets: [ "@babel/preset-env", "@babel/preset-react" ]
            }
          },
          { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader", options: {
            presets: [ "@babel/preset-env", "@babel/preset-react" ]
          }},
          { test: /\.scss$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ] },
          { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
          {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: 'application/font-woff',
              }
            }
          },
          {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: 'application/font-ttf',
              }
            }
          },
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, outputPath, "app"),
        port: 9000
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]

};