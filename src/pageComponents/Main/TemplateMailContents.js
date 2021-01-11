import React, {
  useState,
  useContext,
  Fragment,
  useCallback,
  useEffect
} from "react";
import DomToImage from "dom-to-image";
import styled from "styled-components";
import { globalStateStore } from "../../stores/globalStateStore";
import { mailTemplateStore } from "../../stores/mailTemplateStore";

//components
import EmptyRowPlace from "./TemplateMailContents/EmptyRowPlace";
import RowTable from "./TemplateMailContents/RowTable";
export default function TemplateMailContents({ tableWidth, tableHeight }) {
  // 백그라운드 이미지, boxShadow 관련 상태 저장 store
  const globalState = useContext(globalStateStore);
  const backState = globalState.state;
  const backDispatch = globalState.dispatch;

  // mail 관련 상태 저장 store, tdClasses 등등
  const mailGlobalState = useContext(mailTemplateStore);
  const mailState = mailGlobalState.state;
  const mailDispatch = mailGlobalState.dispatch;

  const [contents, setContents] = useState(mailState.contents);
  const [bgcolor, setBgcolor] = useState(mailState.bgcolor);
  const convertToHTML = () => {
    const resultDoc = document.getElementById("TemplateMailContentsTable");
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
    </head><body background="${backState.convertedImage}" style="background-repeat:no-repeat">
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

  const convertToBackUseCallback = useCallback(() => {
    backDispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: true } });
    const resultDoc = document.getElementById("TemplateMailContentsTable");
    resultDoc.style.background = "";
    setTimeout(() => {
      DomToImage.toPng(resultDoc)
        .then(function (dataUrl) {
          backDispatch({
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

  const onClickAddContentRow = () => {
    const tdClass = {
      align: "center",
      width: "30",
      height: "200",
      content: `<b>td</b>`
    };
    const tdClasses = [tdClass];
    const newContents = { ...mailState.contents };
    const newBody = newContents.body;
    const newContentRowTables = newBody.contentRowTables;
    const tempContentRowTable = newContentRowTables.pop();
    newContentRowTables.push({
      tdClasses: tdClasses
    });
    newContentRowTables.push({
      tdClasses: tempContentRowTable.tdClasses
    });
    setContents(newContents);
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { version: mailState.version + 1, contents: newContents }
    });
  };

  const onClickConvertButton = (e) => {
    convertToBackUseCallback();
  };

  const onClickConvertBoxShadow = (status) => {
    backDispatch({
      type: "CONVERT_BOX_SHADOW",
      value: {
        boxShadow: status
      }
    });
  };

  const temporarySaveCallback = useCallback(() => {
    backDispatch({
      type: "ADD_POPUP_MESSAGE",
      value: { popUpMessage: "임시 저장 중" }
    });
    mailDispatch({ type: "UPDATE_CONTENTS", value: { contents: contents } });
    setTimeout(() => {
      backDispatch({
        type: "ADD_POPUP_MESSAGE",
        value: { popUpMessage: "임시 저장 완료" }
      });
    }, 1500);
  });
  const onClickTemprarySave = () => {
    temporarySaveCallback();
  };
  return (
    <div id="TemplateMailContents" className="container-fluid">
      <MenuDiv>
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
        <ConvertButton
          className="btn btn-outline-dark"
          onClick={onClickConvertButton}
        >
          Background 전환
        </ConvertButton>
        <Button
          className="btn btn-outline-dark"
          onClick={() => {
            onClickTemprarySave();
          }}
        >
          임시저장
        </Button>

        <ConvertButton
          className="btn btn-outline-dark"
          onClick={onClickConvertHtmlButton}
        >
          HTML 변환
        </ConvertButton>
      </MenuDiv>
      <ColorPickerDiv className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">
            배경색
          </span>
          <div id="cp4" class="input-group" title="Using color option">
            <ColorPickerInput
              type="color"
              class="form-control input-lg"
              onChange={(e) => {
                setBgcolor(e.target.value);
              }}
            />
          </div>
        </div>
      </ColorPickerDiv>
      <TemplateFormWrapper>
        <div id="TemplateMailContentsDiv">
          <BackImageDiv>
            <img
              alt=""
              src={backState.convertedImage}
              style={{ width: "auto", height: "auto" }}
            />
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
                    bgcolor={bgcolor}
                    style={{
                      // backgroundColor: "#1a1a1a",
                      backgroundImage: `${backState.convertedImage}`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundColor: `${bgcolor}`
                    }}
                    background={`${backState.convertedImage}`}
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
    margin-right: 5px;
  }
`;
const ColorPickerDiv = styled.div`
  width: 20px;
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
`;
const BackImageDiv = styled.div`
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: ${(props) => `no-repeat url("${props.image}")`};
`;
