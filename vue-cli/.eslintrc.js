module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: ["plugin:vue/vue3-essential", "eslint:recommended"],  //继承vue3和eslint的规则
    parserOptions: {
      parser: "@babel/eslint-parser",  //需要下载@babel/eslint-parser
    },
};