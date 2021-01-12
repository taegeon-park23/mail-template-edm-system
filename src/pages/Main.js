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
