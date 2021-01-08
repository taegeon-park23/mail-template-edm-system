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
