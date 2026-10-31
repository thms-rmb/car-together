import { fileURLToPath } from "node:url";

export default {
  entry: "./app/index.html",
  experiments: {
    html: true,
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "image/[name].[contenthash][ext]",
        },
      },
    ],
  },
  output: {
    path: fileURLToPath(new URL("./dist/", import.meta.url)),
    clean: true,
  },
  devServer: {
    port: 8080,
    hot: true,
  },
};
