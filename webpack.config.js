module.exports = {
    output: {
        publicPath: '/'
    },
    resolve: {
        fallback: {
            process: require.resolve('process/browser'),
            stream: false,
            https: false
        }
    },
    devServer: {
        historyApiFallback: true
    },
}