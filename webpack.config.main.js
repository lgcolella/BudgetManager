const path = require('path');
const webpack = require('webpack');
const outputPath = 'build';

module.exports = {

    target: 'electron-main',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, outputPath)
    },
    module: {
        rules: [
            {
                test: /\.png$/,
                use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-ttf',
                }
                }
            }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production'
        })
    ],
    node: {
        __dirname: false
    }

};