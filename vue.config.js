const path = require('path')
const name = 'Rok Admin'

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/public/' : '/',
  lintOnSave: process.env.NODE_ENV === 'development',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // Provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', name)
  }
}
