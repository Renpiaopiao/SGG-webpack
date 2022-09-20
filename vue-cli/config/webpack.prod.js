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

const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取css成单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// css 压缩
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")
// js 压缩
const TerserWebpackPlugin = require("terser-webpack-plugin")
// 图片压缩
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// 直接赋值public的静态资源-- 赋值favicon.ico
const CopyPlugin = require("copy-webpack-plugin");

// 解析.vue
const { VueLoaderPlugin } = require('vue-loader')

// 定义环境变量
const {DefinePlugin} = require("webpack")


module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: 'static/js/[name].[contenthash:10].js',
        chunkFilename: 'static/js/[name].[contenthash:10].chunk.js',
        // hash:取hash前10位，ext:文件扩展名，query：其他参数
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
        clean: true
    },
    module: {
        rules: [
            // 1. 处理css
            {
                test: /\.css$/,
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
                test: /\.styl$/,
                use: getStyleLoader('stylus-loader')
            },
            // 2.处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                }
            },
            // 3.处理其他资源
            {
                test: /\.(woff2?|ttf)/,
                type: "asset/resource"
            },
            // 4. 处理js 
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,  //缓存不压缩
                    plugins: [
                        // "@babel/plugin-transform-runtime" // 预设presets中包含了
                    ],
                },
            },
            // 5.处理.vue
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }

        ]
    },
    plugins: [
        // eslint配置
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache')
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    globOptions: {
                        ignore: ["**/index.html"],
                    },
                },
            ],
        }),
        new VueLoaderPlugin(),
        // cross-env 给webpack使用
        // DefinePlugin 定义环境变量给源代码使用
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__ :false
        })
    ],
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            chunks: "all"
        },
        // 提取runtime文件,hash 值单独保管在一个 runtime 文件中。
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
            // new ImageMinimizerPlugin({
            //     minimizer: {
            //         implementation: ImageMinimizerPlugin.imageminGenerate,
            //         options: {
            //             plugins: [
            //                 ["gifsicle", { interlaced: true }],
            //                 ["jpegtran", { progressive: true }],
            //                 ["optipng", { optimizationLevel: 5 }],
            //                 [
            //                     "svgo",
            //                     {
            //                         plugins: [
            //                             "preset-default",
            //                             "prefixIds",
            //                             {
            //                                 name: "sortAttrs",
            //                                 params: {
            //                                     xmlnsOrder: "alphabetical",
            //                                 },
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             ],
            //         },
            //     },
            // }),
        ]
    },
    // webpack解析模块时的选项
    resolve: {
        extensions: [".vue", ".js", ".json"]
    }
}