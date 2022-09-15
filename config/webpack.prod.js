const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const os = require('os')
// cpu核数
const threads = os.cpus().length;
const TerserWebpackPlugin = require('terser-webpack-plugin')

const WorkboxPlugin = require("workbox-webpack-plugin");


function getStyleLoader(pre) {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        pre,
    ].filter(Boolean);
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, "../dist"),   //所有打包文件的输出路径
        filename: 'js/[name].[contenthash:8].js',  //入口文件打包输出的文件名,
        chunkFilename: 'js/[name].[contenthash:8].chunk.js',  //打包输出其他文件名，chunk名
        clean: true,   //自动清理dist目录

    },

    // 加载器（lodaer）
    module: {
        rules: [
            {
                oneOf: [
                    {
                        // 用来匹配 .css 结尾的文件
                        test: /\.css$/,
                        // use 数组里面 Loader 执行顺序是从右到左
                        use: getStyleLoader()
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoader('less-loader')
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: getStyleLoader('sass-loader')
                    },
                    {
                        test: /\.(png|jpg?g|gif|webp|svg)$/,
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                maxSize: 20 * 1024 // 小于20kb，转base64  
                            }
                        },
                        generator: {
                            filename: 'image/[hash:10][ext][query]'   //hash:10  取哈希值前10位
                        }
                    },
                    {
                        test: /\.(ttf|woff2?|map3|map4|avi)$/,
                        type: 'asset/resource',    //纯输出这些资源，不需要做转换
                        generator: {
                            filename: 'media/[hash:10][ext][query]'   //hash:10  取哈希值前10位
                        }
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/, // 排除node_modules代码不编译
                        use: [
                            {
                                loader: 'thread-loader',
                                options: {
                                    works: threads
                                }
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true, // 开启babel编译缓存
                                    cacheCompression: false, // 缓存文件不要压缩
                                },
                            }
                        ]

                    }
                ]
            }
        ]
    },

    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_modules',
            cache: true,
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
            threads, // 开启多进程
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename:'css/[name].[contenthash:8].chunk.css'
        }),
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true,
          }),
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin({
                parallel: threads // 开启多进程
            })
        ],
        splitChunks: {   //把node_modules单独分割，动态导入单独分割
            chunks: 'all'
        },
        // 提取runtime文件
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
    },
    mode: 'production',
    devtool: "source-map"
}