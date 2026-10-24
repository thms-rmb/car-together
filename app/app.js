import { createElement } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return createElement("h1", null, "Hello, world!");
}

const root = createRoot(document.getElementById("root"));
root.render(createElement(App));
