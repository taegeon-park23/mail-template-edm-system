import React from "react";
import { Route, Link } from "react-router-dom";
import { StateProvider } from "./stores/globalStateStore";

// pages
import Login from "./pages/Login";
import Main from "./pages/Main";
import PopUp from "./components/PopUp";
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
          <Route path="/login" component={Login} />
          <Route path="/" component={Main} />
          <PopUp />
        </StateProvider>
        {/* <Login /> */}
        {/* <Test /> */}
      </div>
    );
  }
}

export default App;
