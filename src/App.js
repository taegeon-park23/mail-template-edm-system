import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import { StateProvider} from "./stores/globalStateStore";


// pages
import Login from "./pages/Login";
import Main from "./pages/Main";
import PopUp from "./components/PopUp";
// import Test from "./components/page/Test";

import "./styles.css";

const App = () => {
  

    return (
      <div className="Main">
        <StateProvider>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" eaxact={true} component={Main} />
          <PopUp />
          </Switch>
        </StateProvider>
        {/* <Login /> */}
        {/* <Test /> */}
      </div>
    );
}

export default App;
