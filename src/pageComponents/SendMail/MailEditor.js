import React, { useState, useEffect } from "react";
import styled from "styled-components";

import CustomEditor from "../../components/CustomEditor";
import MailContent from "../SendMail/MailContent";

export default function MailEditor({width, content, setContent}) {
  const [editContent, setEditContent] = useState(content ? content: "<p></p>");
  useEffect(() => {
  }, [editContent]);
  return (
    <ResultAreaDiv
    className="form-control"
      id="message"
      name="body"
      rows="12"
      placeholder="Click here to reply" 
    >
      <CustomEditorWrapper width={width}>
      <CustomEditor
              classic={true}
              data={`${content}`}
              onChangeHandler={(event, editor)=>{
                setContent(editor.getData());
                setEditContent(editor.getData());
              }}
              onBlurHandler={(event, editor)=>{
              }}
              onFocusHnadler={()=>{}}
            />
      </CustomEditorWrapper>
      <ResultDiv id="mailResult"><MailContent content={editContent}/></ResultDiv>
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
  display: flex;
  color: black;
  .ck-editor__editable:not(.ck-editor__nested-editable) {
    
    width: inherit;
    min-height: 200px;
  }
  .ck.ck-editor {
    max-width: ${props=>props.width}px;
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
