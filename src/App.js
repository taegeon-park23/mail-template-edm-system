import React from "react";
import { StateProvider } from "./stores/backImageTemplateStore";

// pages
import Login from "./pages/Login";
import Main from "./pages/Main";
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
          <Main />
        </StateProvider>
        {/* <Login /> */}
        {/* <Test /> */}
      </div>
    );
  }
}

export default App;
