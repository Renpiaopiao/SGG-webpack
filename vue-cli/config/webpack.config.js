
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取css成单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// css 压缩
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")
// js 压缩
const TerserWebpackPlugin = require("terser-webpack-plugin")
// 图片压缩  -- 有些情况下下载不下来
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// 直接赋值public的静态资源-- 赋值favicon.ico
const CopyPlugin = require("copy-webpack-plugin");

// 解析.vue
const { VueLoaderPlugin } = require('vue-loader')

// 定义环境变量
const { DefinePlugin } = require("webpack")

// 按需引入elementui
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

// 获取cross-env定义的环境变量
const isProduction = process.env.NODE_ENV === "production"
function getStyleLoader(pre) {
    return [
        isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
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
        pre && {
            loader:pre,
            options:pre === 'sass-loader'?{
                additionalData: `@use "@/styles/element/index.scss" as *;`,
            }:{}
        },
    ].filter(Boolean);
}


module.exports = {
    entry: './src/main.js',
    output: {
        path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
        filename: isProduction ? 'static/js/[name].[contenthash:10].js' : 'static/js/[name].js',
        chunkFilename: isProduction ? 'static/js/[name].[contenthash:10].chunk.js' : 'static/js/[name].chunk.js',
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
                loader: 'vue-loader',
                options:{
                    // 开启缓存
                    cacheDirectory:path.resolve(__dirname, '../node_modules/.cache/vue-loader')
                }
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
        !isProduction && new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
        }),
        !isProduction && new CopyPlugin({
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
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        }),
        // 按需加载element
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver(
                {   //自定义主题覆盖样式
                    importStyle: "sass"
                }
            )],
        })
    ].filter(Boolean),
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: "all",
            // node_modules的文件分开打包
            cacheGroups:{
                vue:{
                    test:/[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    name:'vue-chunk',
                    priority:40
                },
                elementPlus:{
                    test:/[\\/]node_modules[\\/]element-plus(.*)?[\\/]/,
                    name:'elementPlus-chunk',
                    priority:30
                },
                libs:{
                    test:/[\\/]node_modules[\\/]/,
                    name:'libs-chunk',
                    priority:20
                }
            }
        },
        // 提取runtime文件,hash 值单独保管在一个 runtime 文件中。
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
        minimize: isProduction,
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
        extensions: [".vue", ".js", ".json"],
        // 路径别名
        alias:{
            '@':path.resolve(__dirname,'../src')
        }
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,    //开启hmr 样式hmr通过style-loader做，js通过vue或react提供的包做
        historyApiFallback: true   //解决404
    },
    performance:false
}