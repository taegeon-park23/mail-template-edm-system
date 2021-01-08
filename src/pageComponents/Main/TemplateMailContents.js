import React, {
  useState,
  useContext,
  Fragment,
  useCallback,
  useEffect
} from "react";
import DomToImage from "dom-to-image";
import styled from "styled-components";
import { backImageTemplateStore } from "../../stores/backImageTemplateStore";
import { mailTemplateStore } from "../../stores/mailTemplateStore";

//components
import EmptyRowPlace from "./TemplateMailContents/EmptyRowPlace";
import RowTable from "./TemplateMailContents/RowTable";
export default function TemplateMailContents({ tableWidth, tableHeight }) {
  // 백그라운드 이미지, boxShadow 관련 상태 저장 store
  const globalState = useContext(backImageTemplateStore);
  const backState = globalState.state;
  const backDispatch = globalState.dispatch;

  // mail 관련 상태 저장 store, tdClasses 등등
  const mailGlobalState = useContext(mailTemplateStore);
  const mailState = mailGlobalState.state;
  const mailDispatch = mailGlobalState.dispatch;

  const [contents, setContents] = useState(mailState.contents);
  useEffect(() => {
    if (mailState.saveContentsStatus === true) {
      mailDispatch({ TYPE: "UPDATE_CONTENTS", value: { contents: contents } });
    }
  });
  const convertToHTML = () => {
    const resultDoc = document.getElementById("TemplateMailContentsDiv");
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
    console.log(resultDoc);
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
    const tdClass = { align: "center", width: "30", content: `<b>td</b>` };
    const tdClasses = [tdClass];
    const newContents = { ...contents };
    const newBody = newContents.body;
    newBody.contentRowTables.push({ tdClasses: tdClasses });
    setContents(newContents);
  };

  const onClickDeleteContentRow = (index) => {
    const newContents = { ...contents };
    const newBody = newContents.body;
    const tempContentRowTables = newBody.contentRowTables;
    if (index === 0) return;
    if (index === tempContentRowTables.length - 1) {
      tempContentRowTables.pop();
      setContents(newContents);
    } else {
      tempContentRowTables = tempContentRowTables
        .slice(0, index)
        .concat(
          tempContentRowTables.slice(index + 1, tempContentRowTables.length)
        );
      setContents(newContents);
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
    mailDispatch({ type: "SAVE_ON_CONTENTS" });
    setTimeout(() => {
      mailDispatch({ type: "SAVE_OFF_CONTENTS" });
    }, 50);
  });
  const onClickTemprarySave = () => {
    temporarySaveCallback();
  };

  const tdHeader = {
    align: "center",
    width: "100",
    content: `<p><b>header</b></p>`
  };
  const tdFooter = {
    align: "center",
    width: "100",
    content: `<p><b>footer</b></p>`
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
          borderOn
        </Button>
      ) : (
        <Button
          className="btn btn-outline-dark"
          onClick={() => {
            onClickConvertBoxShadow(false);
          }}
        >
          borderOff
        </Button>
      )}
      <Button
        className="btn btn-outline-dark"
        onClick={() => {
          onClickAddContentRow();
        }}
      >
        Add-Content-Row
      </Button>
      <ConvertButton
        className="btn btn-outline-dark"
        onClick={onClickConvertButton}
      >
        Convert
      </ConvertButton>
      <Button
        className="btn btn-outline-dark"
        onClick={() => {
          onClickTemprarySave();
        }}
      >
        temporary save
      </Button>

      <ConvertButton
        className="btn btn-outline-dark"
        onClick={onClickConvertHtmlButton}
      >
        ConvertToHTML
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
          <table
            id="TemplateMailContentsTable"
            border={0}
            cellPadding={0}
            cellSpacing={0}
            width={tableWidth}
            // background={`${backState.convertedImage}`}
            // style={{ background: `no-repeat url("${backState.convertedImage}")` }}
          >
            <tbody>
              {/* header */}
              <RowTable height={200} tdClasses={contents.header.tdClasses} />
              <EmptyRowPlace height={30} />
              {/* content */}
              {contents.body.contentRowTables.map((contentRowTale, i) => {
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
              })}
              {/* footer */}
              <RowTable height={100} tdClasses={contents.footer.tdClasses} />
            </tbody>
          </table>
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
