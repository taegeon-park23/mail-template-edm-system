import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { StateProvider } from "../stores/mailTemplateStore";
// import styled from "styled-components";
// import ReactHtmlParser from "react-html-parser";

// components
import MainSidebar from "../pageComponents/Main/MainSidebar";
import MainDropdownBar from "../pageComponents/Main/MainDropDownBar";
import TemplateBackground from "../pageComponents/Main/TemplateBackground";
import TemplateMailContents from "../pageComponents/Main/TemplateMailContents";

import { globalStateStore } from "../stores/globalStateStore";

import { mailTemplateStore } from "../stores/mailTemplateStore";
export default function Main() {
  const globalState = useContext(globalStateStore);
  const { state, dispatch } = globalState;
  const mailStateStore = useContext(mailTemplateStore);
  const mailState = mailStateStore.state;
  const mailDispatch = mailStateStore.dispatch;

  useEffect(() => {
    const TemplateBackgroundDom = document.getElementById("TemplateBackground");
    const TemplateMailContentsDom = document.getElementById(
      "TemplateMailContents"
    );
    //[페이지 전환] TemplateBackground, TemplateMailContents page 전환
    if (state.templateBackground === "backMail") {
      TemplateMailContentsDom.style.display = "none";
      TemplateBackgroundDom.style.display = "block";
    } else if (state.templateBackground === "backImage") {
      TemplateBackgroundDom.style.display = "none";
      TemplateMailContentsDom.style.display = "block";
    }
  });

  return (
    <MainDiv id="wrapper">
      {/* <!-- Sidebar --> */}
      <MainSidebar scale={state.toggle} />
      {/* <!-- Page Content --> */}
      <MainContentDiv>
        {/* dropdown 메뉴 */}

        <MainDropdownBar onClickToggle={state.onClickToggle} />
        <TemplateBackground />
        {/* 템플릿 중간 저장, 중가 저장 및 불러오기를 위한 StateProvider */}
        <StateProvider>
          <TemplateMailContents />
        </StateProvider>
      </MainContentDiv>
      {/* <!-- /#page-content-wrapper --> */}
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
