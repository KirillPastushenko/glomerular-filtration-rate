
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './public'),
    assets: 'assets/'
}

module.exports = {
    externals: {
        paths:PATHS
    },
    entry: {
        app: PATHS.src
    },
    output: {
        filename: `${PATHS.assets}js/[name].[hash].js`,
        path: PATHS.dist,
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name:'vendors',
                    test: '/node_modules/',
                    chunks: 'all',
                    enforce:true
                }
            }
        }
    },
    module: {
        rules:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude:'/node_modules/'
            }, {
                test:/\.vue$/,
                loader:'vue-loader',
                options: {
                    loader: {
                        scss:'vue-style-loader!css-loader!sass-loader'
                    }
                }
            }, {
                test:/\.(png|jpg|jpeg|svg|gif)$/,
                loader:'file-loader',
                options:{
                    name: '[name].[ext]'
                }
            }, {
                test:/\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    }, {
                        loader: 'postcss-loader',
                        options: {sourceMap: true, config: {path: `${PATHS.src}/js/postcss.config.js`}}
                    }, {
                        loader: 'sass-loader',
                        options: {sourceMap: true}
                    }
                ]
            },{
                test:/\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    },
                    {
                        loader: 'postcss-loader',
                        options: {sourceMap: true, config: {path: `${PATHS.src}/js/postcss.config.js`}}
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename:`${PATHS.assets}css/[name].[hash].css`,
        }),
        new HtmlWebpackPlugin({
            hash:false,
            template:`${PATHS.src}/index.html`,
            filename: './index.html'
        }),
        new CopyWebpackPlugin({patterns: [
            {
                from: `${PATHS.src}/img`, 
                to: `${PATHS.assets}img`
            },
            {
                from: `${PATHS.src}/static`, 
                to: ''
            }
        ]})
    ]
}