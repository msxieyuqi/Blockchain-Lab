const path = require("path");
module.exports = {
    mode: 'development',
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
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
            "os": false,
            "constants": require.resolve("constants-browserify"),
            "crypto-browserify": require.resolve('crypto-browserify'),
        }
    },
    // module: {
    //     loaders: [{
    //         test: /\.js$/,
    //         loader: 'babel-loader'
    //     }]
    // }
}