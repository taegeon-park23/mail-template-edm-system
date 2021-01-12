<<<<<<< HEAD
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderClassName = (scale) => {
    if (scale === null) return "";
    if (scale === true) return "sidebar-scale-up";
    if (scale === false) return "sidebar-scale-down";
  };

  render() {
    //Sidebar
    return (
      <ul
        className="navbar-nav bg-gradient-dark sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Sidebar --- brand */}
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/"
        >
          <div className="">
            <i style={{ textTransform: "none" }}>BizDEM</i>
          </div>
        </Link>

        <hr className="sidebar-divider my-0" />

        <li className="nav-item active">
          <Link className="nav-link" to="/sendmail">
            <i className="fas fa-fw fa-tachometer-alt">✉</i>
            <span>&nbsp;메일보내기</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider" />

        {/* Heading */}
        <div className="sidebar-heading">메일쓰기</div>

        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <span>&nbsp;임시보관함</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/createtemplate">
            <span>&nbsp;템플릿 생성</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <span>&nbsp;템플릿 보관</span>
          </Link>
        </li>
        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">주소록 관리</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <span>&nbsp;그룹관리</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">
            {/* <i>☎</i> */}
            <span>&nbsp;전체주소록관리</span>
          </Link>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">Status</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <span>&nbsp;발송이력</span>
          </Link>
        </li>
        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">시스템 관리</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <span>&nbsp;공지사항</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <span>&nbsp;Q&A</span>
          </Link>
          <Link className="nav-link collapsed" to="/">
            <span>&nbsp;계정관리</span>
          </Link>
        </li>
      </ul>
    );
  }
}

export default MainSidebar;
=======
import React from "react";

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderClass = (scale) => {
    if (scale === null) return "";
    if (scale === true) return "sidebar-scale-up";
    if (scale === false) return "sidebar-scale-down";
  };

  render() {
    return (
      <div
        className={
          "bg-light border-right " + this.renderClass(this.props.scale)
        }
        id="sidebar-wrapper"
      >
        <div
          className={"sidebar-heading " + this.renderClass(this.props.scale)}
        >
          Start Bootstrap{" "}
        </div>
        <div
          className={
            "list-group list-group-flush " + this.renderClass(this.props.scale)
          }
        >
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Dashboard
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Shortcuts
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Overview
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Events
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Profile
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Status
          </a>
        </div>
      </div>
    );
  }
}

export default MainSidebar;
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98
