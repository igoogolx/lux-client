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
              onlyCompileBundledFiles: true,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        "lux-js-sdk": path.resolve(__dirname, "..", "modules", "lux-js-sdk"),
      },
    },
    externals: {
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      }),
    ],
    target: "electron-main",
  };
};
