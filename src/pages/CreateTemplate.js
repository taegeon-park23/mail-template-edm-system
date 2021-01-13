import React, { useEffect, useContext, useCallback } from "react";
import styled from "styled-components";

import DomToImage from "dom-to-image";
import TemplateBackground from "../pageComponents/CreateTemplate/TemplateBackground";
import TemplateMailContents from "../pageComponents/CreateTemplate/TemplateMailContents";
import { globalStateStore } from "../stores/globalStateStore";

export default function CreateTemplate({}) {
  const globalState = useContext(globalStateStore);
  const { state, dispatch } = globalState;

  const convertToBackUseCallback = useCallback(() => {
    dispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: true } });
    const resultDoc = document.getElementById("TemplateMailContentsTable");
    resultDoc.style.background = "";
    setTimeout(() => {
      DomToImage.toPng(resultDoc)
        .then(function (dataUrl) {
          dispatch({
            type: "CONVERTING_IMAGE",
            value: {
              convertedImage: dataUrl,
              modifiableBoxesState: true,
              templateBackground: "backMail",
              tableHeight: resultDoc.offsetHeight
            }
          });
        })
        .catch(function (err) {
          alert("oops ", err);
        });
    });
  });

  const onClickConvertToBackButton = (e) => {
    convertToBackUseCallback();
  };

  // Background Image 수정 화면과 Mail From 화면 전환 callBack
  const convertToMailCallback = useCallback(() => {
    dispatch({
      type: "ON_OFF_ALL_MODIFIABLE_BOXES_STATE",
      value: { modifiableBoxesState: false },
    });
    const resultDoc = document.getElementById("templateFomrTable");
    resultDoc.style.background = "";
    DomToImage.toPng(resultDoc)
      .then(function (dataUrl) {
        dispatch({
          type: "CONVERTING_IMAGE",
          value: {
            convertedImage: dataUrl,
            modifiableBoxesState: false,
            templateBackground: "backImage",
          },
        });
      })
      .catch(function (err) {
        alert("oops ", err);
      });
  });

  const onClickConvertToMailTemplateButton = (e) => {
    convertToMailCallback();
  };


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
    <CreateTemplateDiv className="container-fluid ">
      <div class="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p class=" mr-auto">
            <h3>템플릿 생성</h3><sup>{state.templateBackground === "backImage" ?"메일템플릿":"배경화면"}</sup>
          </p>
        </div>
      
        <div className="w-100 d-flex flex-row-reverse">
        {state.templateBackground ==="backImage" ?
         <button className="btn btn-primary" onClick={onClickConvertToBackButton}>배경화면</button> :
         <button className="btn btn-primary" onClick={onClickConvertToMailTemplateButton}>메일템플릿</button>}
      </div>
      <hr/>
      <TemplateBackground />
      <TemplateMailContents />
      <EmptyDiv><hr/></EmptyDiv>
    </CreateTemplateDiv>
  );
}

const CreateTemplateDiv = styled.div``;
const EmptyDiv = styled.div`
  width: 100%;
  height: 100px;
`;