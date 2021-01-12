<<<<<<< HEAD
import React, { useContext, useEffect } from "react";
import { Route, Link, Switch } from "react-router-dom";
import styled from "styled-components";

import { StateProvider } from "../stores/mailTemplateStore";
import MainSidebar from "../pageComponents/Main/MainSidebar";
import MainDropdownBar from "../pageComponents/Main/MainDropDownBar";

//pages
import CreateTemplate from "../pages/CreateTemplate";
import SendMail from "../pages/SendMail";
export default function Main() {
  return (
    <MainDiv id="wrapper">
      {/* <!-- Sidebar --> */}
      <MainSidebar />
      {/* <!-- Page Content --> */}
      <MainContentDiv>
        {/* dropdown 메뉴 */}
        <MainDropdownBar />
        <div class="container-fluid">
        <Switch>
          <StateProvider>
            <Route path="/createtemplate" component={CreateTemplate} />
            <Route path="/sendmail" component={SendMail} />
          </StateProvider>
          <Route
            // path 를 따로 정의하지 않으면 모든 상황에 렌더링됨
            render={({ location }) => (
              <div>
                <h2>이 페이지는 존재하지 않습니다:</h2>
                <p>{location.pathname}</p>
              </div>
            )}
          />
        </Switch>
        </div>
      </MainContentDiv>
    </MainDiv>
  );
}


const MainDiv = styled.div`
  display: flex;
`;

const MainContentDiv = styled.div`
  min-width: 760px;
  width: 100vw;
`;
=======
import React, { useContext, useEffect } from "react";
// import styled from "styled-components";
// import ReactHtmlParser from "react-html-parser";

// components
import MainSidebar from "../pageComponents/Main/MainSidebar";
import MainDropdownBar from "../pageComponents/Main/MainDropDownBar";
import TemplateBackground from "../pageComponents/Main/TemplateBackground";
import TemplateMailContents from "../pageComponents/Main/TemplateMailContents";

import { backImageTemplateStore } from "../stores/backImageTemplateStore";
import "./Main.css";
export default function Main() {
  const globalState = useContext(backImageTemplateStore);
  const { state, dispatch } = globalState;

  useEffect(() => {
    const TemplateBackgroundDom = document.getElementById("TemplateBackground");
    const TemplateMailContentsDom = document.getElementById(
      "TemplateMailContents"
    );
    //[페이지 전환] TemplateBackground, TemplateMailContents page 전환
    console.log(state.templateBackground);
    if (state.templateBackground === "backMail") {
      TemplateMailContentsDom.style.display = "none";
      TemplateBackgroundDom.style.display = "block";
    } else if (state.templateBackground === "backImage") {
      TemplateBackgroundDom.style.display = "none";
      TemplateMailContentsDom.style.display = "block";
    }
  });

  return (
    <div className="d-flex" id="wrapper">
      {/* <!-- Sidebar --> */}
      <MainSidebar scale={state.toggle} />
      {/* <!-- Page Content --> */}
      <div id="page-content-wrapper">
        {/* dropdown 메뉴 */}

        <MainDropdownBar onClickToggle={state.onClickToggle} />

        <TemplateBackground />
        <TemplateMailContents tableWidth={600} />
      </div>
      {/* <!-- /#page-content-wrapper --> */}
    </div>
  );
}
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98
