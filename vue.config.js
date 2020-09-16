const webpackMockServer = require("webpack-mock-server");

module.exports = {
  lintOnSave: false,
  devServer: {
    hot: false,
    port: 8976,
    host: '0.0.0.0',
    public: '10.96.8.8:8976',
    disableHostCheck: true,
    before: webpackMockServer.use,
  }
}