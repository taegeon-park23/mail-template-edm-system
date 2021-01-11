import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// bootstrap
import "./include/bootstrap";
// Importing the Bootstrap CSS
import "./include/css/bootstrap.min.css";
import "./assets/css/sb-admin-2.css";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
// ReactDOM.render(<App />, document.getElementById("root"));
