import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme, Loader } from "@mantine/core";
import { RingLoader } from "./components/RingLoader.tsx";

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: "ring",
      },
    }),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
