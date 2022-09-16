function getStyleLoader(pre) {
    return [
        "style-loader",
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



module.exports = {
    entry:'./src/main.js',
    output:{
        path:undefined,
        filename:'static/js/[name].js',
        chunkFilename:'static/js/[name].chunk.js',
        // hash:取hash前10位，ext:文件扩展名，query：
        assetModuleFilename:'static/media/[hash:10][ext][query]'
    },
    module:{
        rules:[
            // 1. 处理css
            {
                test:/\.css$/,
                use:getStyleLoader()
            },
            {
                test:/\.less$/,
                use:getStyleLoader('less-loader')
            },
            {
                test:/\.s[ac]ss$/,
                use:getStyleLoader('sass-loader')
            },
            {
                test:/\.styl$/,
                use:getStyleLoader('stylus-loader')
            },
            // 2.处理图片
            {
                test:/\.(jpe?g|png|gif|webp|svg)/,
                type:"asset",
                parser:{
                    dataUrlCondition:{
                        maxSize:10 * 1024
                    }
                }
            },
            // 3.处理其他资源
            {
                test:/\.(woff2?|ttf)/,
                type:"asset/resource"
            },
            // 4. 处理js 
            {
                test: /\.(jsx|js)$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  cacheCompression: false,  //缓存不压缩
                  plugins: [
                    // "@babel/plugin-transform-runtime" // 预设presets中包含了
                  ],
                },
            }

        ]
    },
    plugins:[
        // eslint配置
        new ESLintPlugin({
            context:path.resolve(__dirname,'../src'),
            exclude:'node_modules',
            cache:true,
            cacheLocation:path.resolve(__dirname,'../node_modules/.cache/.eslintcache')
        }),
        HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../public/index.html')
        })
    ],
    mode:'development',
    devtool:'cheap-module-source-map',
    optimization:{
        splitChunks:{
            chunks:"all"
        },
        // 提取runtime文件,hash 值单独保管在一个 runtime 文件中。
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
    },
    devServer:{
        host:'localhost',
        port:3000,
        open:true,
        hot:true
    }
}