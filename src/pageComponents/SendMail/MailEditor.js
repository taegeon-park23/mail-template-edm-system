import React, { useState, useEffect } from "react";
import styled from "styled-components";

import ReactHtmlParser from "react-html-parser";
import CustomEditor from "../../components/CustomEditor";

export default function MailEditor({width}) {
  const [editContent, setEditContent] = useState("<p></p>");
  useEffect(() => {}, [editContent]);
  return (
    <ResultAreaDiv
      class="form-control"
      id="message"
      name="body"
      rows="12"
      placeholder="Click here to reply" 
    >
      <CustomEditorWrapper width={width}>
        <CustomEditor
          childrenHtml={`<p>hello</p>`}
          synkEditorToResult={(html) => {
            setEditContent(html);
          }}
        />
      </CustomEditorWrapper>
      <ResultDiv id="mailResult">{ReactHtmlParser(editContent)}</ResultDiv>
      <ResultDivOveray>&nbsp;</ResultDivOveray>
    </ResultAreaDiv>
  );
}

const ResultAreaDiv = styled.div`
  border: solid 2px #d1d3e2;
  border-bottom: none;
  border-radius: 5px;
  position: relative;
  display: flex;
  justify-content: center;
  
`;
const CustomEditorWrapper = styled.div`
width: ${props=>props.width}px;
  p {
    margin-bottom: 0px;
  }
`;
const ResultDivOveray = styled.div`
  position: absolute;
  width: 100%;
  top: 40px;
  height: 600px;
  z-index: -20;
`;
const ResultDiv = styled.div`
  position: absolute;
  width: 100%;
  background-color: white;
  top: 40px;
  height: 600px;
  z-index: -30;
`;
