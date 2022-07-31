const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  return {
    entry: {
      index: path.resolve(__dirname, "..", "app", "index.ts"),
      preload: path.resolve(__dirname, "..", "app", "preload.ts"),
    },
    output: {
      path: path.resolve(__dirname, "..", "src"),
      clean: {
        dry: true,
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: {
              allowTsInNodeModules: true,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    externals: {},
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      }),
    ],
    target: "electron-main",
  };
};
