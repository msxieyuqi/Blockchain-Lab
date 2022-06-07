const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
    mode: 'development',
    devtool: isProd ? false : 'eval-source-map',
    entry: path.join(__dirname, "./src/index.js"),
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "bundle.js"
    },
    devServer: {
        static: path.join(__dirname, "/"),
        port: 7545
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer"),
            "crypto": false,
            "os": false,
            "constants": require.resolve("constants-browserify"),
            "crypto-browserify": require.resolve('crypto-browserify'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './template.html'),
            scriptLoading: 'blocking'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_DEBUG': false
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
    // module: {
    //     loaders: [{
    //         test: /\.js$/,
    //         loader: 'babel-loader'
    //     }]
    // }
}