// Include Path module
const Path = require('path');

// Require Webpack
const Webpack = require('webpack');

module.exports = {
  // Initial all setting.
  configureWebpack(config) {
    // Add Setting.
    return {
      resolve: {
        alias: {
          'views': Path.resolve(__dirname, 'src/views/'),
          'assets': Path.resolve(__dirname, 'src/assets/'),
          'components': Path.resolve(__dirname, 'src/components/')
        }
      },
      plugins: [
        new Webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        })
      ]
    }
  }
}