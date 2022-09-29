const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'./dist'),
        filename:'js/[name].js',
        clean:true
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                loader:"./loaders/clear-log-loader.js"
            },
            {
                test:/\.js$/,
                loader:"./loaders/banner-loader",
                options:{
                    author:'yuchun'
                }
            },
            {
                test:/\.js$/,
                loader:"./loaders/babel-loader",
                options:{
                    presets:["@babel/preset-env"]
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        })
    ],
 
    mode:'development'
}