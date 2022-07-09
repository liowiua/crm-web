const path = require('path');
function resolve(dir) {
    // join(__dirname) 设置绝对路径。 dirname代表当前所在文件路径
    return path.join(__dirname, dir);
}

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack:(config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
}
})