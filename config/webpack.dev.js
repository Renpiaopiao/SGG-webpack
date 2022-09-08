const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/main.js',
    output: {
        path: undefined,
        filename: 'js/main.js'  //入口文件打包输出的文件
    },

    // 加载器（lodaer）
    module: {
        rules: [
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
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
                loader: "babel-loader",
            }
        ]
    },

    plugins: [
        new ESLintPlugin({
            context:path.resolve(__dirname,'../src')
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        })
    ],

    // 开发服务器:不会输出资源，在内存打包，只在浏览器有效果
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
    },

    mode: 'development'
}