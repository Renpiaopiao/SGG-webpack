const schema  = require("./schema.json")

module.exports = function (content) {
    // 符合JSON schema原则
    const options = this.getOptions(schema)

    const prefix = `/*author： ${options.author}  */`
    return prefix + content
}