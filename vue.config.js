// Include Path module
const Path = require('path');

module.exports = {
  // Initial all setting.
  configureWebpack(config) {
    // Add Setting.
    return {
      resolve: {
        alias: {
          'page': Path.resolve(__dirname, 'src/views/page/'),
          'views': Path.resolve(__dirname, 'src/views/'),
          'assets': Path.resolve(__dirname, 'src/assets/'),
          'components': Path.resolve(__dirname, 'src/components/')
        }
      }
    }
  }
}