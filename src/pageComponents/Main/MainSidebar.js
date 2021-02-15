import React from "react";
import { Link } from "react-router-dom";

class MainSidebar extends React.Component {
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
          <Link className="nav-link" to="/sendmail/0">
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
          <Link className="nav-link" to="/draft">
            <span>&nbsp;임시보관함</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/createtemplate:0">
            <span>&nbsp;템플릿 생성</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/templatestorage">
            <span>&nbsp;템플릿 보관</span>
          </Link>
        </li>
        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">주소록 관리</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <Link className="nav-link" to="/managegroup">
            <span>&nbsp;그룹관리</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/manageaddressbook">
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
          <Link className="nav-link" to="/senditems">
            <span>&nbsp;발송이력</span>
          </Link>
        </li>
        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">시스템 관리</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <Link className="nav-link" to="/notification">
            <span>&nbsp;공지사항</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/questionandanswer">
            <span>&nbsp;Q&A</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/manageUsers">
            <span>&nbsp;사용자 관리</span>
          </Link>
        </li>
      </ul>
    );
  }
}

export default MainSidebar;
