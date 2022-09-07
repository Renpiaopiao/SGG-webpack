const path = require('path')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, "dist"),   //所有打包文件的输出路径
        filename: 'js/main.js',  //入口文件打包输出的文件名
        clean:true   //自动清理dist目录
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
            }
        ]
    },

    plugins: [

    ],

    mode: 'development'
}