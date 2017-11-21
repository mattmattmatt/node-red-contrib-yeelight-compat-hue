const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const copyPlugin = new CopyWebpackPlugin([{ from: './*.html' }], {
    copyUnmodified: false,
});

module.exports = {
    entry: './yeelight-compat-hue.js',
    output: {
        filename: 'yeelight-compat-hue.js',
        path: path.resolve(__dirname, '../dist'),
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
};
