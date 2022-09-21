/**
 * loader就是一个函数，调用处理，然后返回内容
 * map:source-map
 * meta:别的loader传递的数据
 */
// 1.同步loader
module.exports = function(content,map,mata){
    console.log(content);
    return content
}

