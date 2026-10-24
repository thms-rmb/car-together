import { fileURLToPath } from "node:url";

export default {
  entry: "./app/index.html",
  experiments: {
    html: true,
    css: true,
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
