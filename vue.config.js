module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/constructor/'
    : '/',
  css: {
    extract: false
  },
  productionSourceMap: false
}
