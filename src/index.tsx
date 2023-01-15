import * as React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
// import aws amplify
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import AuthProvider from "./contexts/AuthContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// configure amplify
Amplify.configure(awsExports);

root.render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <CssBaseline />
      <App />
    </AuthProvider>
  </ThemeProvider>
);
