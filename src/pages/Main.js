import React, { useContext, useEffect } from "react";
import { Route, Link, Switch } from "react-router-dom";
import styled from "styled-components";

import { StateProvider,mailTemplateStore } from "../stores/mailTemplateStore";
import MainSidebar from "../pageComponents/Main/MainSidebar";
import MainDropdownBar from "../pageComponents/Main/MainDropDownBar";


//pages
import CreateTemplate from "./CreateTemplate";
import SendMail from "./SendMail";
import Draft from "./Draft";
import ManageGroup from "./ManageGroup";
import ManageAddressbook from "./ManageAddressbook";
import TemplateStorage from "./TemplateStorage";
import SendItems from "./SendItems";
import Notification from "./Notification";
import QuestionAndAnser from "./QuestionAndAnswer";
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
          <StateProvider>
            <Switch>
              <Route path="/createtemplate" component={CreateTemplate} />
              <Route path="/sendmail" component={SendMail} />
              <Route path="/draft" component={Draft}/>
              <Route path="/managegroup" component={ManageGroup}/>
              <Route path="/manageaddressbook" component={ManageAddressbook}/>
              <Route path="/templatestorage" component={TemplateStorage}/>
              <Route path="/senditems" component={SendItems}/>
              <Route path="/notification" component={Notification}/>
              <Route path="/questionandanswer" component={QuestionAndAnser}/>
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
          </StateProvider>
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
