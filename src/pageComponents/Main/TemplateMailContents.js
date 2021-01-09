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
  const convertToHTML = () => {
    const resultDoc = document.getElementById("TemplateMailContentsTable");
    const downloadHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Email Design</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head><body background="${backState.convertedImage}" style="background-repeat:no-repeat">${resultDoc.innerHTML}</body></html>`;
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
    newBody.contentRowTables.push({ tdClasses: tdClasses });
    mailDispatch({ type: "UPDATE_CONTENTS", value: { contents: newContents } });
  };

  const onClickDeleteContentRow = (index) => {
    const newContents = { ...mailState.contents };
    const newBody = newContents.body;
    let tempContentRowTables = newBody.contentRowTables;
    if (index === 0) return;
    if (index === tempContentRowTables.length - 1) {
      tempContentRowTables.pop();
      mailDispatch({
        type: "UPDATE_CONTENTS",
        value: { contents: newContents }
      });
    } else {
      tempContentRowTables = tempContentRowTables
        .slice(0, index)
        .concat(
          tempContentRowTables.slice(index + 1, tempContentRowTables.length)
        );
      mailDispatch({
        type: "UPDATE_CONTENTS",
        value: { contents: newContents }
      });
    }
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
              // background={`${backState.convertedImage}`}
            >
              <tbody>
                {/* header */}
                <RowTable
                  header={true}
                  height={200}
                  tdClasses={mailState.contents.header.tdClasses}
                />
                <EmptyRowPlace height={30} />
                {/* content */}
                {mailState.contents.body.contentRowTables.map(
                  (contentRowTale, i) => {
                    return (
                      <Fragment>
                        <RowTable
                          rowTableIndex={i}
                          deleteRowTable={onClickDeleteContentRow}
                          height={300}
                          tdClasses={contentRowTale.tdClasses}
                        />
                        <EmptyRowPlace height={30} />
                      </Fragment>
                    );
                  }
                )}
                {/* footer */}
                <RowTable
                  footer={true}
                  height={100}
                  tdClasses={mailState.contents.footer.tdClasses}
                />
              </tbody>
            </table>
          </div>
        </div>
      </TemplateFormWrapper>
    </div>
  );
}

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
