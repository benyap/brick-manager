const lodash = require("lodash");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const isEnvProduction = process.env.NODE_ENV === "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";

// #region Common settings
const commonConfig = {
  devtool: isEnvDevelopment ? "source-map" : false,
  mode: isEnvProduction ? "production" : "development",
  output: { path: path.join(__dirname, "build") },
  node: { __dirname: false, __filename: false },
  resolve: {
    alias: {
      "~": path.join(__dirname, "src", "renderer"),
    },
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|png|svg|ico|icns)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
};
// #endregion

// #region Main config
const mainConfig = lodash.cloneDeep(commonConfig);
mainConfig.entry = "./src/main/main.ts";
mainConfig.target = "electron-main";
mainConfig.output.filename = "main.bundle.js";
mainConfig.plugins = [
  new CopyPlugin({
    patterns: [
      {
        from: "package.json",
        to: "package.json",
        transform: (content, _path) => {
          const jsonContent = JSON.parse(content);

          delete jsonContent.devDependencies;
          delete jsonContent.scripts;
          delete jsonContent.build;

          jsonContent.main = "./main.bundle.js";
          jsonContent.scripts = { start: "electron ./main.bundle.js" };
          jsonContent.postinstall = "electron-builder install-app-deps";

          return JSON.stringify(jsonContent, undefined, 2);
        },
      },
    ],
  }),
];
// #endregion

// #region Renderer config
const rendererConfig = lodash.cloneDeep(commonConfig);
rendererConfig.entry = "./src/renderer/renderer.tsx";
rendererConfig.target = "electron-renderer";
rendererConfig.output.filename = "renderer.bundle.js";
rendererConfig.plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "./public/index.html"),
  }),
];
// #endregion

module.exports = [mainConfig, rendererConfig];
