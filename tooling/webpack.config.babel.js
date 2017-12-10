const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const copyPlugin = new CopyWebpackPlugin([{ from: './*.html' }], {
    copyUnmodified: false,
});

module.exports = {
    entry: {
        'yeelight-compat-hue-out': './yeelight-compat-hue-out.js',
        'yeelight-compat-hue-state': './yeelight-compat-hue-state.js',
        'yeelight-compat-hue-config': './yeelight-compat-hue-config.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        library: 'yeelight-compat-hue',
        libraryTarget: 'umd',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0'],
                },
            },
        ],
    },
    plugins: [copyPlugin],
    externals: /^[^.]/,
};
