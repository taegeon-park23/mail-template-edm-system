import React, {
  useState,
  useContext,
  Fragment,
  useCallback,
  useEffect,
} from "react";
import styled from "styled-components";
import Modal from "../../components/Modal";
import TdStyle from "../../components/TdStyle";
import { globalStateStore } from "../../stores/globalStateStore";
import { mailTemplateStore } from "../../stores/mailTemplateStore";
import ReactComment from "../../components/ReactComment";
//components
import RowTable from "./TemplateMailContents/RowTable";
import getHtmlString from "../../getHtmlString";

export default function TemplateMailContents({result, tplNo }) {
 // 저장한 테이블 백그라운드 이미지
 let backgrundSrc = `https://firebasestorage.googleapis.com/v0/b/bizdem-c4931.appspot.com/o/images%2F${tplNo?tplNo:"nope"}%2Fbackground.png?alt=media&time=${(new Date()).getTime()}`;
  
  
// ===========================================================================================================
// ================== contexts =====================================================================================
// ============================================================================================================
  // 백그라운드 이미지, boxShadow 관련 상태 저장 store
  const globalState = useContext(globalStateStore);
  const backState = globalState.state;
  const backDispatch = globalState.dispatch;

  // mail 관련 상태 저장 store, tdClasses 등등
  const mailGlobalState = useContext(mailTemplateStore);
  const mailState = mailGlobalState.state;
  const mailDispatch = mailGlobalState.dispatch;


  // ============================================================================================================
  // ==================  states =====================================================================================
  // ============================================================================================================
  const [bgcolor, setBgcolor] = useState(mailState.bgcolor);              // string, div의 background color state
  const [tdStyleModalStatus, setTdStyleModalStatus] = useState(false);    // boolean, TdStyleModal on&off state


  

  // ============================================================================================================
  // ===================== useEffect ===================================================================================
  // ============================================================================================================
  // backgroundColor 변환시 mailState 동기화
  useEffect(() => {
    mailDispatch({ type: "UPDATE_BGCOLOR", value: { bgcolor: bgcolor, version: mailState.version+1 } });
  }, [bgcolor]);






// ===========================================================================================================
// ==================  functions =====================================================================================
// ============================================================================================================
  // HTML파일로 변환하여 다운로드
  const convertToHTML = () => {
    const resultDoc = document.getElementById("TemplateMailContentsDiv");
    resultDoc.style.background = `${backState.convertedImage}`;
    resultDoc.style.backgroundImage = `${backState.convertedImage}`;
    // 다운로드
    const downloadHtml = getHtmlString(resultDoc);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/html;charset=utf-8," + encodeURIComponent(downloadHtml)
    );
    element.setAttribute("download", "mail");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

// Row(tr) 추가 함수
const addContentRow = (number) => {
  const tdClass = {
    align: "center",
    width: "100",
    height: "100",
    content: `<b>td</b>`,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  };

  const tdClasses = [];
  switch(number) {
    case 3:
      for(let i=0; i<number; i++) tdClasses.push({...tdClass, width:"33.3"});
      break;
    case 2:
      for(let i=0; i<number; i++) tdClasses.push({...tdClass, width:50});
      break;
    case 1:
      tdClasses.push(tdClass);
      break;
    default:
      break; 
  }
  
  const newContents = { ...mailState.contents };
  const newBody = newContents.body;
  const newContentRowTables = newBody.contentRowTables;
  newContentRowTables.push({
    tdClasses: tdClasses,
  });
  mailDispatch({
    type: "UPDATE_CONTENTS",
    value: { version: mailState.version + 1, contents: newContents },
  });
};


// boxShadow 변환 함수
const convertBoxShadow = (status) => {
  backDispatch({
    type: "CONVERT_BOX_SHADOW",
    value: {
      boxShadow: status,
    },
  });
};


// ===========================================================================================================
// ================== callback =====================================================================================
// ============================================================================================================
  // 결과 생성 버튼 Callback
  const converToHTMLCallback = useCallback(() => {
    backDispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: false } });
    setTimeout(convertToHTML, 250);
  });

  // 임시저장 callback
  const temporaryDownloadCallback = useCallback(() => {
    if (localStorage.length > 0) {
      backDispatch({
        type: "ADD_POPUP_MESSAGE",
        value: { popUpMessage: "임시 저장된 템플릿을 불러오고 있습니다." },
      });
      mailDispatch({
        type: "DOWNLOAD_MAIL_STATE",
        value: { mailState: JSON.parse(localStorage.getItem("tempMailState")) },
      });
    } else {
      alert("불러올게 없습니다.");
    }
  });

  // 임시저장 불러오기 callback
  const temporarySaveCallback = useCallback(() => {
    backDispatch({
      type: "ADD_POPUP_MESSAGE",
      value: { popUpMessage: "임시 저장 중" },
    });
    localStorage.removeItem("tempMailState");
    localStorage.setItem("tempMailState", JSON.stringify(mailState));
    mailDispatch({
      type: "SAVE_ONOFF_CONTENTS",
      value: { saveContentsStatus: true },
    });
    setTimeout(() => {
      mailDispatch({
        type: "SAVE_ONOFF_CONTENTS",
        value: { saveContentsStatus: false },
      });
    }, 1000);
    setTimeout(() => {
      backDispatch({
        type: "ADD_POPUP_MESSAGE",
        value: { popUpMessage: "임시 저장 완료" },
      });
    }, 1500);
  });







// ===========================================================================================================
// ================== handler =====================================================================================
// ============================================================================================================
  // 모달 종료 버튼 핸들러
  const modalCloseButtonOnClickHandler = () => {
    setTdStyleModalStatus(false);
  }

  // 테두리 ON버튼 핸들러
  const onBoxShadowOnClickHandler = () => {
    convertBoxShadow(true);
  };

  // 테두리 OFF버튼 핸들러
  const offBoxShadowOnClickHandler = () => {
    convertBoxShadow(false);
  };

  
  // content추가 버튼 핸들러
  const addContentButtonOnClickHandler = () => {
    setTdStyleModalStatus(true);
  }

  // 임시저장 버튼 핸들러
  const temporarySaveButtonOnClickHandler = () => {
    temporarySaveCallback();
  };

  // 임시저장 불러오기 버튼 핸들러
  const temporaryDownloadButtonOnClickHandler = () => {
    temporaryDownloadCallback();
  };

  // HTML 버튼 핸들러
  const convertHtmlButtonOnClickHandler = () => {
    converToHTMLCallback();
  };

  // 배경색 변환 버튼 핸들러
  const bgColorButtonOnChangeHandler = (event) => {
    setBgcolor(event.target.value);
  }

  // 배경색 지우기 버튼 핸들러
  const bgColorDeleteButtonOnChangeHandler = () => {
    setBgcolor("");
  } 




// ============================================================================================================
// ============================ HTML ====================================================================================
// ============================================================================================================
  return (
    <div id="TemplateMailContents" className="container-fluid">
      {tdStyleModalStatus === true ? 
       <Modal
       visible={tdStyleModalStatus}
       onClose={modalCloseButtonOnClickHandler}
       children={
         <TdStyle
         addContentRow={addContentRow}
           onClose={modalCloseButtonOnClickHandler}
         />
       }
     />
      : null}

      {result !== true ? (
        <Fragment>
          <p
            className="text-center d-flex justify-content-center rounded-pill"
            style={{ height: "30px" }}
          >
            <h5>템플릿을 수정하세요</h5>
          </p>
          <h6 className="d-flex justify-content-center">
            <strong className="text-primary">
              메일 시스템에 따라 화면이 달라질 수 있습니다.
            </strong>
          </h6>

          <MenuDiv className="shadow-sm p-3 mb-3 bg-white rounded">
            {backState.boxShadow === false ? (
              <Button
                className="btn btn-outline-dark"
                onClick={onBoxShadowOnClickHandler}
              >
                {`테두리 ON`}
              </Button>
            ) : (
              <Button
                className="btn btn-outline-dark"
                onClick={offBoxShadowOnClickHandler}
              >
                {`테두리 OFF`}
              </Button>
            )}
            <Button
              className="btn btn-outline-dark"
              onClick={addContentButtonOnClickHandler}
            >
              Content 추가
            </Button>
            <Button
              className="btn btn-outline-dark"
              onClick={temporarySaveButtonOnClickHandler}
            >
              임시저장
            </Button>
            <Button
              className="btn btn-outline-dark"
              onClick={temporaryDownloadButtonOnClickHandler}
            >
              임시저장 불러오기
            </Button>

            <ConvertButton
              className="btn btn-outline-dark"
              onClick={convertHtmlButtonOnClickHandler}
            >
              HTML 변환
            </ConvertButton>
          </MenuDiv>
          <ColorPickerDiv className="input-group mb-1">
              <span className="btn btn-secondary border rounded mr-3 d-flex align-items-center">
                W {backState.tableWidth}{", "}H {backState.tableHeight}
              </span>
            <div className="input-group-prepend">
              
              <span className="input-group-text" id="basic-addon1">
                배경색
              </span>
              <div
                className="input-group mr-3"
                title="Using color option"
              >
                <ColorPickerInput
                  type="color"
                  className="form-control input-lg"
                  onChange={bgColorButtonOnChangeHandler}
                />
              </div>
              <button style={{height:"30px"}} className="input-group-text" onClick={bgColorDeleteButtonOnChangeHandler}>
                  배경색지우기
              </button>
            </div>
          </ColorPickerDiv>
        </Fragment>
      ) : null}

      <TemplateFormWrapper>
        <div id="TemplateMailContentsDiv" className="container-fluid">
            <div role="article" aria-roledescription="email" 
              style={{width:`100%`, textSizeAdjust:"100%", WebkitTextSizeAdjust:"100%", msTextSizeAdjust:"100%", backgroundColor:`${mailState.bgcolor}`}}
            >
            <table
              role="prsentation"
              style={{width:"100%", border:"none", borderSpacing:"0"}}
              border={0}
              cellPadding={0}
              cellSpacing={0}
            >
              <tbody>
                <tr>
                    <td align="center" style={{padding:0}}>
                      <ReactComment content={`<!--[if mso] <table role="presentation" align="center" style="width:600px;"> <tr> <td> <![endif]-->`}/>
                      <table role="presentation"
                        id="TemplateMailContentsTable"
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        style={{width:"94%", maxWidth:"600px", border:"none", borderSpacing:0, fontFamily:"Arial, sans-serif", backgroundImage:`url(${backgrundSrc})`}}>
                      {mailState.contents.body.contentRowTables.map(
                        (contentRowTale, i) => {
                          return (
                            <tr>
                            <td>
                            <RowTable
                              key={`${mailState.version}-${i}`}
                              rowTableIndex={i}
                              height={300}
                              tdClasses={contentRowTale.tdClasses}
                            />
                            </td>
                            </tr>
                          );
                        }
                      )}
                      </table>
                      <ReactComment content={`<!--[if mso]></td></tr></table><![endif]-->`}/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </TemplateFormWrapper>
    </div>
  );
}






// ============================================================================================================
// ============================ HTML ====================================================================================
// ============================================================================================================
const MenuDiv = styled.div`
  margin-bottom: 40px;
  padding: 5px;
  font-size: 1em;
  width: 100%;
  display: flex;
  justify-content: center;
  button {
    margin-right: 10px;
  }
`;
const ColorPickerDiv = styled.div`
  width: 100%;
  span {
    height: 30px;
  }
`;
const ColorPickerInput = styled.input`
  width: 30px;
  height: 30px;
`;
const Button = styled.button``;
const ConvertButton = styled.button``;
const TemplateFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
