const schema  = require("./schema.json")

// 图片、字体都是文件，buffer数据
// 需要使用raw loader

module.exports = function(content){
    const options = this.getOptions(schema)
    
}