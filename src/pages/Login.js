<<<<<<< HEAD
import React from "react";

import "./Login.css";
import bizeMDIcon from "../assets/images/BizeMD.PNG";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="sign-in">
        <div className="text-center shadow p-3 mb-5 bg-white rounded">
          <form className="form-signin">
            <img
              className="mb-4"
              src={bizeMDIcon}
              alt=""
              width="120"
              height="50"
            />
            {/* <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1> */}
            <label htmlFor="inputEmail" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              id="inputEmail"
              className="form-control"
              placeholder="👥 id"
              required
              autoFocus
            />
            <label htmlFor="inputPassword" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              className="form-control"
              placeholder="🔒 Password"
              required
            />
            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Sign in
            </button>
            <p className="mt-5 mb-3 text-muted">&copy; 2020</p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
=======
import React from "react";

import "./Login.css";
import bizeMDIcon from "../assets/images/BizeMD.PNG";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="sign-in">
        <div className="text-center shadow p-3 mb-5 bg-white rounded">
          <form className="form-signin">
            <img
              className="mb-4"
              src={bizeMDIcon}
              alt=""
              width="120"
              height="50"
            />
            {/* <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1> */}
            <label htmlFor="inputEmail" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              id="inputEmail"
              className="form-control"
              placeholder="👥 id"
              required
              autoFocus
            />
            <label htmlFor="inputPassword" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              className="form-control"
              placeholder="🔒 Password"
              required
            />
            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Sign in
            </button>
            <p className="mt-5 mb-3 text-muted">&copy; 2020</p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98
