import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import TemplateBackground from "../pageComponents/CreateTemplate/TemplateBackground";
import TemplateMailContents from "../pageComponents/CreateTemplate/TemplateMailContents";
import { globalStateStore } from "../stores/globalStateStore";

export default function CreateTemplate({}) {
  const globalState = useContext(globalStateStore);
  const { state } = globalState;

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
    <CreateTemplateDiv>
      <TemplateBackground />
      <TemplateMailContents />
    </CreateTemplateDiv>
  );
}

const CreateTemplateDiv = styled.div``;
