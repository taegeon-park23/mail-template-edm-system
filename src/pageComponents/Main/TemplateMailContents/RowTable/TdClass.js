import React, {
  useState,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useCallback
} from "react";
import styled from "styled-components";

import Modal from "../../../../components/Modal";
import CustomEditor from "../../../../components/CustomEditor";
import ReactHtmlParser from "react-html-parser";
import { backImageTemplateStore } from "../../../../stores/backImageTemplateStore";
export default function TdClass({
  rowTableIndex,
  index,
  tdClass,
  height,
  deleteTd
}) {
  const initialModalStatus = false;
  const initialContent = tdClass.content;
  const intialTdWidth = tdClass.width;
  const intialTdHeight = height;
  const [modalStatus, setModalStatus] = useState(initialModalStatus);
  const [menuStatus, setMenuStatus] = useState(false);
  const [tdWidth, setTdWidth] = useState(intialTdWidth);
  const [tdHeight, setTdHeight] = useState(intialTdHeight);
  const [useEditWidth, setUseEditWidth] = useState(true);
  const [useEditHeight, setUseEditHeight] = useState(true);
  const [content, setContent] = useState(initialContent);

  const tdRef = useRef(null);
  useEffect(() => {
    if (tdRef !== null) {
      const tdCount = tdRef.current.parentElement.children.length;
      if (tdCount === 1) {
        setUseEditWidth(false);
        setUseEditHeight(true);
      } else if (tdCount > 1) {
        setUseEditHeight(false);
        setUseEditWidth(true);
      }
    }
  });
  const globalState = useContext(backImageTemplateStore);
  const { state } = globalState;
  const tdShadowStyle = {
    padding: 10,
    boxShadow: "1px 1px 3px gray, -1px -1px 3px gray"
  };
  const tdNonShadowStyle = { padding: 10 };
  const tempTdStyle =
    state.boxShadow === true ? tdShadowStyle : tdNonShadowStyle;
  const tdStyle =
    menuStatus === true
      ? { ...tempTdStyle, position: "relative" }
      : { ...tempTdStyle, position: "block" };
  return (
    <Fragment>
      {modalStatus === true ? (
        <Modal
          visible={modalStatus}
          onClose={setModalStatus}
          children={
            <CustomEditor
              synkEditorToResult={(html) => {
                setContent(html);
              }}
              // onClose={onClickEditorModalButton}
              childrenHtml={`${content}`}
            />
          }
        />
      ) : null}

      <td
        ref={tdRef}
        style={tdStyle}
        align={tdClass.align}
        valign={"middle"}
        width={`${tdWidth}%`}
        height={tdHeight}
        onMouseOver={() => {
          setMenuStatus(true);
        }}
        onMouseLeave={() => {
          setMenuStatus(false);
        }}
      >
        {menuStatus === true ? (
          <Menus
            onMouseEnter={() => {
              setMenuStatus(true);
            }}
          >
            <EditButton
              className="btn btn-primary"
              onClick={() => {
                setModalStatus(true);
              }}
            >
              <span>✏</span>
            </EditButton>
            {useEditWidth === true ? (
              <Fragment>
                <NumberInputDiv>
                  <label>{`W`}</label>
                  <InputNumberSlider
                    type="number"
                    min="25"
                    max="75"
                    size="3"
                    value={tdWidth}
                    onChange={(event) => {
                      setTdWidth(parseInt(event.target.value));
                    }}
                  />
                </NumberInputDiv>
              </Fragment>
            ) : null}
            {useEditHeight === true ? (
              <NumberInputDiv>
                <label>H</label>
                <InputNumberSlider
                  type="number"
                  min="10"
                  max="600"
                  value={tdHeight}
                  onChange={(event) => {
                    setTdHeight(parseInt(event.target.value));
                  }}
                />
                <label>px</label>
              </NumberInputDiv>
            ) : null}
            {useEditWidth === true ? (
              <EditButton
                className="btn btn-primary"
                onClick={() => {
                  deleteTd(index);
                }}
              >
                <span role="img" aria-label="img">
                  ➖
                </span>
              </EditButton>
            ) : null}
          </Menus>
        ) : null}
        {ReactHtmlParser(content)}
      </td>
    </Fragment>
  );
}

const Menus = styled.div`
  position: absolute;
  background: none;
  display: flex;
  top: 0px;
  left: 0;
`;

const EditButton = styled.button`
  position: relative;
  width: 30px;
  height: 30px;
  padding: 0px;
  font-weight: 800;
  margin: 5px;
`;

const NumberInputDiv = styled.div`
  height: 30px;
  border-radius: 5px;
  background-color: #007bff;
  border-color: #007bff;
  display: flex;
  padding: 1px;
  /* align-items: stretch; */
  font-weight: 800;
  margin: 5px;
  input[type="number"] {
    border-radius: 5px;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const InputNumberSlider = styled.input``;
