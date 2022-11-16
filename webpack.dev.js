const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const webpackConfig = merge(common, {
  mode: "development",
  devtool: "inline-source-map",

  devServer: {
    contentBase:"./dist",
    inline:true,
    port:8080
  },
  
});

module.exports = webpackConfig;
