const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
  const isDev = env.NODE_ENV === "development";
  return {
    optimization: {
      minimize: !isDev,
      usedExports: true,
    },
    devtool: isDev ? "source-map" : false,
    entry: path.resolve(
      __dirname,
      "..",
      "src",
      "index.tsx"
    ),
    output: {
      path: path.resolve(__dirname, "..", "dist", "ui"),
      filename: "bundle.js",
      clean: {
        dry: true,
      },
    },
    devServer: {
      compress: true,
      port: 3001,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.svg/,
          type: "asset/inline",
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              allowTsInNodeModules: true,
              happyPackMode: !isDev,
              onlyCompileBundledFiles: true,
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
            },
            "postcss-loader",
          ],
          exclude: /\.module\.css$/,
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                esModule: false,
                importLoaders: 1,
                modules: {
                  localIdentName: isDev
                    ? "[path][name]__[local]--[hash:base64:5]"
                    : "[hash:base64]",
                  getLocalIdent: (_context, _localIdentName, localName) => {
                    if (localName === "dark") return "dark";
                  },
                },
              },
            },
            "postcss-loader",
          ],
          include: /\.module\.css$/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "..",  "src"),
        "lux-js-sdk": path.resolve(__dirname, "..", "modules", "lux-js-sdk"),
      },
    },
    plugins: [
      env.withBundleAnalyzer && new BundleAnalyzerPlugin(),
      isDev && new Dotenv(),
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          "..",
          "src",
          "index.html"
        ),
      }),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
        "process.env.CLIENT_VERSION": JSON.stringify(env.CLIENT_VERSION || ""),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(
              __dirname,
              "..",
              "public"
            ),
            to: path.resolve(__dirname, "..", "dist", "ui", "public"),
          },
        ],
      }),
    ].filter(Boolean),
  };
};
