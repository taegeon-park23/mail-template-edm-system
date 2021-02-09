import React from "react";
const MainDropdownBar = ({history}) => {

    return (
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        {/* <!-- Sidebar Toggle (Topbar) --> */}
        <button
          id="sidebarToggleTop"
          className="btn btn-link d-md-none rounded-circle mr-3"
        >
          <i className="fa fa-bars"></i>
        </button>

        <ul className="navbar-nav ml-auto">
          {/* <!-- Nav Item - Alerts --> */}
          <li className="nav-item dropdown no-arrow mx-1">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="alertsDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-bell fa-fw"></i>
              {/* <!-- Counter - Alerts --> */}
              <span className="badge badge-danger badge-counter">3+</span>
            </a>
            </li>
            
          {/* <!-- Nav Item - User Information --> */}
          <li className="nav-item dropdown no-arrow">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={(e)=>{
                  e.preventDefault();
                  localStorage.removeItem('jwtToken');
                  history.push('/login');
              }}
            >
              <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                Logout
              </span>
              <i><span role="img" aria-label="search">🧏🏻‍♂️</span></i>
            </a>
          </li>
        </ul>
      </nav>
    );
}
export default MainDropdownBar;
