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

//components
import EmptyRowPlace from "./TemplateMailContents/EmptyRowPlace";
import RowTable from "./TemplateMailContents/RowTable";
export default function TemplateMailContents({ tableWidth, tableHeight }) {
  const globalState = useContext(backImageTemplateStore);
  const { state, dispatch } = globalState;
  const tdClass = { align: "center", width: "30", content: `<b>td</b>` };
  const tdClasses = [tdClass, tdClass, tdClass];
  const initialContents = [{ tdClasses: tdClasses }];
  const [contents, setContents] = useState(initialContents);
  useEffect(() => {});
  const convertToHTML = () => {
    const resultDoc = document.getElementById("TemplateMailContentsDiv");
    const downloadHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Email Design</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head><body>${resultDoc.innerHTML}</body></html>`;
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
    dispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: false } });
    setTimeout(convertToHTML, 250);
  });

  const onClickConvertHtmlButton = (e) => {
    converToHTMLCallback();
  };

  const convertToBackUseCallback = useCallback(() => {
    dispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: true } });
    const resultDoc = document.getElementById("TemplateMailContentsTable");
    resultDoc.style.background = "";
    console.log(resultDoc);
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

  const onClickAddContentRow = () => {
    const tdClass = { align: "center", width: "30", content: `<b>td</b>` };
    const tdClasses = [tdClass];
    const newContents = [].concat(contents);
    newContents.push({ tdClasses: tdClasses });
    setContents(newContents);
  };

  const onClickDeleteContentRow = (index) => {
    const tempContents = [].concat(contents);
    if (index === 0) return;
    if (index === tempContents.length - 1) {
      tempContents.pop();
      setContents(tempContents);
    } else {
      const newContents = tempContents
        .slice(0, index)
        .concat(tempContents.slice(index + 1, tempContents.length));
      setContents(newContents);
    }
  };
  const onClickConvertButton = (e) => {
    convertToBackUseCallback();
  };

  const onClickConvertBoxShadow = (status) => {
    dispatch({
      type: "CONVERT_BOX_SHADOW",
      value: {
        boxShadow: status
      }
    });
  };
  const tdHeader = {
    align: "center",
    width: "100",
    content: `<p><b>header</b></p>`
  };
  const tdIneraction = {
    align: "center",
    width: "100",
    content: `<a href="#"><p><font color="#147e94">Button</font></p></a>`
  };
  const tdFooter = {
    align: "center",
    width: "100",
    content: `<p><b>footer</b></p>`
  };
  const tdHeaderClasses = [tdHeader];
  const tdIneractionClasses = [tdClass, tdIneraction];
  const tdFooterClasses = [tdFooter];
  return (
    <div id="TemplateMailContents" className="container-fluid">
      {state.boxShadow === false ? (
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
      <ConvertButton
        className="btn btn-outline-dark"
        onClick={onClickConvertHtmlButton}
      >
        ConvertToHTML
      </ConvertButton>

      <TemplateFormWrapper>
        <div id="TemplateMailContentsDiv">
          <table
            id="TemplateMailContentsTable"
            border={0}
            cellPadding={0}
            cellSpacing={0}
            width={tableWidth}
            background={`${state.convertedImage}`}
            style={{ background: `no-repeat url("${state.convertedImage}")` }}
          >
            <tbody>
              {/* header */}
              <RowTable height={200} tdClasses={tdHeaderClasses} />
              <EmptyRowPlace height={30} />
              {/* content */}
              {contents.map((tdClasses, i) => {
                return (
                  <Fragment>
                    <RowTable
                      rowTableIndex={i}
                      deleteRowTable={onClickDeleteContentRow}
                      height={300}
                      tdClasses={tdClasses.tdClasses}
                    />
                    <EmptyRowPlace height={30} />
                  </Fragment>
                );
              })}
              {/* footer */}
              <RowTable height={100} tdClasses={tdFooterClasses} />
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
