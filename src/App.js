import React from "react";
<<<<<<< HEAD
import { Route, Link } from "react-router-dom";
import { StateProvider } from "./stores/globalStateStore";
=======
import { StateProvider } from "./stores/backImageTemplateStore";
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98

// pages
import Login from "./pages/Login";
import Main from "./pages/Main";
<<<<<<< HEAD
import PopUp from "./components/PopUp";
=======
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98
// import Test from "./components/page/Test";

import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Main">
        <StateProvider>
<<<<<<< HEAD
          <Route path="/login" component={Login} />
          <Route path="/" component={Main} />
          <PopUp />
=======
          <Main />
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98
        </StateProvider>
        {/* <Login /> */}
        {/* <Test /> */}
      </div>
    );
  }
}

export default App;
