import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { DAppProvider } from "@usedapp/core";
import { rpcUrl, supportedChainId } from "./config";

import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "remixicon/fonts/remixicon.css";

const config = {
  readOnlyChainId: supportedChainId,
  readOnlyUrls: {
    [supportedChainId]: rpcUrl,
  },
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <Router>
        <App />
      </Router>
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
