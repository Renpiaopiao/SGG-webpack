const loaderUtils = require("loader-utils")

// 图片、字体都是文件，buffer数据
// 需要使用raw loader

module.exports = function(content){

    // 1.根据文件内容生成带hash值的文件名
    const interpolatedName =  loaderUtils.interpolateName(this,"[hash].[ext][query]",{content})
    
    // 2.将文件输出
    this.emitFile(interpolatedName,content)

    // 3、返回值
    return `module.exports = "${interpolatedName}"`
}


module.exports.raw = true