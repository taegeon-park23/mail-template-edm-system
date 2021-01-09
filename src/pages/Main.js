import React, { useContext, useEffect } from "react";
import { StateProvider } from "../stores/mailTemplateStore";
// import styled from "styled-components";
// import ReactHtmlParser from "react-html-parser";

// components
import MainSidebar from "../pageComponents/Main/MainSidebar";
import MainDropdownBar from "../pageComponents/Main/MainDropDownBar";
import TemplateBackground from "../pageComponents/Main/TemplateBackground";
import TemplateMailContents from "../pageComponents/Main/TemplateMailContents";

import { globalStateStore } from "../stores/globalStateStore";
import "./Main.css";
export default function Main() {
  const globalState = useContext(globalStateStore);
  const { state, dispatch } = globalState;

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
    <div className="d-flex" id="wrapper">
      {/* <!-- Sidebar --> */}
      <MainSidebar scale={state.toggle} />
      {/* <!-- Page Content --> */}
      <div id="page-content-wrapper">
        {/* dropdown 메뉴 */}

        <MainDropdownBar onClickToggle={state.onClickToggle} />

        <TemplateBackground />

        {/* 템플릿 중간 저장, 중가 저장 및 불러오기를 위한 StateProvider */}
        <StateProvider>
          <TemplateMailContents tableWidth={600} />
        </StateProvider>
      </div>
      {/* <!-- /#page-content-wrapper --> */}
    </div>
  );
}
