const path = require('path');
const outputPath = 'build';
const webpack = require('webpack');

module.exports = {

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
          { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
          { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" },
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
    ],
    externals: {
        sqlite3: 'sqlite3'
    }

};