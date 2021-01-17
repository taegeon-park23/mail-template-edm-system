import React, {
  useState,
  useContext,
  Fragment,
  useCallback,
  useEffect,
} from "react";
import styled from "styled-components";
import { globalStateStore } from "../../stores/globalStateStore";
import { mailTemplateStore } from "../../stores/mailTemplateStore";

//components
import RowTable from "./TemplateMailContents/RowTable";
export default function TemplateMailContents({ tableWidth, result }) {
  // 백그라운드 이미지, boxShadow 관련 상태 저장 store
  const globalState = useContext(globalStateStore);
  const backState = globalState.state;
  const backDispatch = globalState.dispatch;

  // mail 관련 상태 저장 store, tdClasses 등등
  const mailGlobalState = useContext(mailTemplateStore);
  const mailState = mailGlobalState.state;
  const mailDispatch = mailGlobalState.dispatch;

  // const [result, setResult] = useState(result);

  const [contents, setContents] = useState(mailState.contents);
  const [bgcolor, setBgcolor] = useState(mailState.bgcolor);
  useEffect(() => {
    mailDispatch({ type: "UPDATE_BGCOLOR", value: { bgcolor: bgcolor, version: mailState.version+1 } });
  }, [bgcolor]);
  const convertToHTML = () => {
    const resultDoc = document.getElementById("TemplateMailContentsTable");
    resultDoc.style.background = `${backState.convertedImage}`;
    resultDoc.style.backgroundImage = `${backState.convertedImage}`;
    const downloadHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Email Design</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
      <v:rect xmlns_v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;">
        <v:fill type="tile" src="${backState.convertedImage}" color="#7bceeb" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
    <!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    </head><body style="background-repeat:no-repeat">
    <!--[if gte mso 9]>
               <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#fff1e6"></v:fill>
			</v:background>
		<![endif]-->
    ${resultDoc.innerHTML}
    </body></html>`;
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

  //   결과 생성 버튼
  const converToHTMLCallback = useCallback(() => {
    backDispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: false } });
    setTimeout(convertToHTML, 250);
  });

  const onClickConvertHtmlButton = (e) => {
    converToHTMLCallback();
  };

  const onClickAddContentRow = () => {
    const tdClass = {
      align: "center",
      width: "30",
      height: "200",
      content: `<b>td</b>`,
    };
    const tdClasses = [tdClass];
    const newContents = { ...mailState.contents };
    const newBody = newContents.body;
    const newContentRowTables = newBody.contentRowTables;
    const tempContentRowTable = newContentRowTables.pop();
    newContentRowTables.push({
      tdClasses: tdClasses,
    });
    newContentRowTables.push({
      tdClasses: tempContentRowTable.tdClasses,
    });
    setContents(newContents);
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { version: mailState.version + 1, contents: newContents },
    });
  };

  const onClickConvertBoxShadow = (status) => {
    backDispatch({
      type: "CONVERT_BOX_SHADOW",
      value: {
        boxShadow: status,
      },
    });
  };

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

  const onClickTemprarySave = () => {
    temporarySaveCallback();
  };

  const onClickTempraryDownload = () => {
    temporaryDownloadCallback();
  };
  return (
    <div id="TemplateMailContents" className="container-fluid">
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
                onClick={() => {
                  onClickConvertBoxShadow(true);
                }}
              >
                {`테두리 ON`}
              </Button>
            ) : (
              <Button
                className="btn btn-outline-dark"
                onClick={() => {
                  onClickConvertBoxShadow(false);
                }}
              >
                {`테두리 OFF`}
              </Button>
            )}
            <Button
              className="btn btn-outline-dark"
              onClick={() => {
                onClickAddContentRow();
              }}
            >
              Content 추가
            </Button>
            <Button
              className="btn btn-outline-dark"
              onClick={() => {
                onClickTemprarySave();
              }}
            >
              임시저장
            </Button>
            <Button
              className="btn btn-outline-dark"
              onClick={() => {
                onClickTempraryDownload();
              }}
            >
              임시저장 불러오기
            </Button>

            <ConvertButton
              className="btn btn-outline-dark"
              onClick={onClickConvertHtmlButton}
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
                id="cp4"
                className="input-group mr-3"
                title="Using color option"
              >
                <ColorPickerInput
                  type="color"
                  className="form-control input-lg"
                  onChange={(e) => {
                    setBgcolor(e.target.value);
                  }}
                />
              </div>
            </div>
          </ColorPickerDiv>
        </Fragment>
      ) : null}

      <TemplateFormWrapper>
        <div id="TemplateMailContentsDiv">
          <BackImageDiv id="backImageDiv">
            &nbsp;
            {backState.convertedImage !== "#" ? (
              <img
                alt=""
                src={backState.convertedImage}
                style={{ width: "auto", height: "auto" }}
              />
            ) : null}
          </BackImageDiv>
          <div id="TemplateMailContentsTable">
            <table
              border={0}
              cellPadding={0}
              cellSpacing={0}
              width={tableWidth}
            >
              <tbody>
                <tr>
                  <td
                    bgcolor={mailState.bgcolor}
                    style={{
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundColor: `${mailState.bgcolor}`,
                    }}
                  >
                    {mailState.contents.body.contentRowTables.map(
                      (contentRowTale, i) => {
                        return (
                          <RowTable
                            key={`${mailState.version}-${i}`}
                            rowTableIndex={i}
                            height={300}
                            tdClasses={contentRowTale.tdClasses}
                          />
                        );
                      }
                    )}
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
  height: 100%;
`;

const Button = styled.button``;
const ConvertButton = styled.button``;
const TemplateFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
const BackImageDiv = styled.div`
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;
