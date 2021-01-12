import React from "react";
import ReactDOM from "react-dom";
<<<<<<< HEAD
import { BrowserRouter } from "react-router-dom";

=======
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98
import App from "./App";

// bootstrap
import "./include/bootstrap";
// Importing the Bootstrap CSS
import "./include/css/bootstrap.min.css";
<<<<<<< HEAD
import "./assets/css/sb-admin-2.css";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
=======

ReactDOM.render(<App />, document.getElementById("root"));
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98
// ReactDOM.render(<App />, document.getElementById("root"));
