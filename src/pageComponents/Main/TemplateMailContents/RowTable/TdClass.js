<<<<<<< HEAD
import React, {
  useState,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useCallback
} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Modal from "../../../../components/Modal";
import AddImageModal from "../../../../components/AddImageModal";
import CustomEditor from "../../../../components/CustomEditor";
import ReactHtmlParser from "react-html-parser";
import { globalStateStore } from "../../../../stores/globalStateStore";
import { mailTemplateStore } from "../../../../stores/mailTemplateStore";
export default function TdClass({
  rowIndex,
  colIndex,
  rowTableIndex,
  index,
  tdClass,
  deleteTd
}) {
  const globalState = useContext(globalStateStore);
  const { state } = globalState;
  const _mailState = useContext(mailTemplateStore);
  const mailState = _mailState.state;
  const mailDispatch = _mailState.dispatch;
  const firstTdClass =
    mailState.contents.body.contentRowTables[rowTableIndex].tdClasses[0];

  const initialTdWidth =
    colIndex !== undefined
      ? mailState.contents.body.contentRowTables[rowTableIndex].tdClasses[
          colIndex
        ][0].width
      : tdClass.width;
  const initialTdHeight =
    colIndex !== undefined
      ? mailState.contents.body.contentRowTables[rowTableIndex].tdClasses[
          colIndex
        ][rowIndex].height
      : firstTdClass.height;
  const [editModalStatus, setEditModalStatus] = useState(false);
  const [imageModalStatus, setImageModalStatus] = useState(false);
  const [menuToggleStatus, setMenuToggleStatus] = useState(false);
  const [menuStatus, setMenuStatus] = useState(false);
  const [tdBgcolor, setTdBgcolor] = useState(tdClass.bgcolor);
  const [tdWidth, setTdWidth] = useState(initialTdWidth);
  const [tdHeight, setTdHeight] = useState(initialTdHeight);
  const [content, setContent] = useState(tdClass.content);
  const [tdBorderRadius, setTdBorderRadius] = useState(tdClass.borderRadius);
  const [image, setImage] = useState(null);

  const tdHeightInputRef = useRef(null);
  const tdRef = useRef(null);
  useEffect(() => {
    const newContents = { ...mailState.contents };
    if (colIndex === undefined) {
      newContents.body.contentRowTables[
        rowTableIndex
      ].tdClasses[0].height = tdHeight;
      newContents.body.contentRowTables[rowTableIndex].tdClasses[index] = {
        ...tdClass,
        bgcolor: tdBgcolor,
        width: tdWidth,
        content: content,
        borderRadius: tdBorderRadius
      };
    } else {
      newContents.body.contentRowTables[rowTableIndex].tdClasses[colIndex][
        rowIndex
      ].height = tdHeight;
      newContents.body.contentRowTables[rowTableIndex].tdClasses[colIndex][
        rowIndex
      ] = {
        ...tdClass,
        bgcolor: tdBgcolor,
        width: tdWidth,
        height: tdHeight,
        content: content,
        borderRadius: tdBorderRadius
      };
    }
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents }
    });
  }, [content, tdWidth, tdHeight, tdBorderRadius]);

  const tdShadowStyle = {
    boxShadow: "0.5px 0.5px 0.5px gray, -1px -1px 0.5px gray",
    backgroundColor: { tdBgcolor },
    borderRadius: `${tdBorderRadius}px`
  };
  const tdNonShadowStyle = {
    backgroundColor: { tdBgcolor },
    borderRadius: `${tdBorderRadius}px`
  };
  const tempTdStyle =
    state.boxShadow === true ? tdShadowStyle : tdNonShadowStyle;
  const tdStyle =
    menuStatus === true || menuToggleStatus === true
      ? { ...tempTdStyle, position: "relative" }
      : { ...tempTdStyle, position: "block" };

  const openEditorCallback = useCallback((html) => {
    setImage(null);
    setContent(html);
  });

  const tempHeight =
    colIndex !== undefined
      ? tdHeight
      : mailState.contents.body.contentRowTables[rowTableIndex].tdClasses[0]
          .height;
  return (
    <Fragment>
      {editModalStatus === true ? (
        <Modal
          visible={editModalStatus}
          onClose={setEditModalStatus}
          children={
            <CustomEditor
              synkEditorToResult={(html) => {
                openEditorCallback(html);
              }}
              // onClose={onClickEditorModalButton}
              childrenHtml={`${content}`}
            />
          }
        />
      ) : null}
      {imageModalStatus === true ? (
        <Modal
          visible={imageModalStatus}
          onClose={setImageModalStatus}
          children={
            <AddImageModal
              onlySrc={true}
              synkEditorToResult={(image) => {
                setImage(image);
              }}
            />
          }
        />
      ) : null}

      <td
        ref={tdRef}
        bgcolor={tdBgcolor}
        style={tdStyle}
        align={tdClass.align}
        valign={"middle"}
        width={tdWidth}
        height={tempHeight}
        onMouseOver={() => {
          setMenuToggleStatus(true);
        }}
        onMouseLeave={() => {
          setMenuToggleStatus(false);
        }}
      >
        {menuToggleStatus === true && state.boxShadow === true ? (
          <MenuToggle
            className="btn btn-primary"
            onClick={() => {
              setMenuStatus(true);
            }}
          >
            ⚈⚈⚈
          </MenuToggle>
        ) : null}
        {menuStatus === true && state.boxShadow === true ? (
          <Menus height={tdHeight}>
            <CloseButton
              className="btn btn-warning"
              onClick={() => {
                setMenuStatus(false);
              }}
            >
              <span>×</span>
            </CloseButton>
            <EditButton
              className="btn btn-primary"
              onClick={() => {
                setEditModalStatus(true);
              }}
            >
              <span>박스수정</span>
            </EditButton>
            <EditButton
              className="btn btn-primary"
              onClick={() => {
                const tdClassIndex = colIndex !== undefined ? colIndex : index;
                const newContents = mailState.contents;
                const newContentRowTalbes = newContents.body.contentRowTables;
                const newTdClass =
                  newContentRowTalbes[rowTableIndex].tdClasses[tdClassIndex];
                newTdClass.content = "<p>td</p>";
                if (colIndex !== undefined) {
                  newTdClass.push(newTdClass[0]);
                } else {
                  newContentRowTalbes[rowTableIndex].tdClasses[tdClassIndex] = [
                    newTdClass,
                    newTdClass
                  ];
                }
                mailDispatch({
                  type: "UPDATE_CONTENTS",
                  value: {
                    contents: newContents,
                    version: mailState.version + 1
                  }
                });
              }}
            >
              <span>박스분할</span>
            </EditButton>
            <EditButton
              className="btn btn-primary"
              onClick={() => {
                setTdBgcolor("");
                setContent(`<p></p>`);
              }}
            >
              <span>여백전환</span>
            </EditButton>
            <EditButton
              className="btn btn-primary"
              onClick={() => {
                setImageModalStatus(true);
              }}
            >
              <span>이미지</span>
            </EditButton>
            {deleteTd ? (
              <EditButton
                className="btn btn-primary"
                onClick={() => {
                  const newIndex = colIndex !== undefined ? colIndex : index;
                  deleteTd(newIndex);
                }}
              >
                <span role="img" aria-label="img">
                  박스 삭제
                </span>
              </EditButton>
            ) : null}
            <NumberInputDiv>
              <label>&nbsp;br</label>
              <InputNumberSlider
                type="number"
                min="0"
                max={1000}
                size="3"
                value={tdBorderRadius}
                onChange={(event) => {
                  setTdBorderRadius(parseInt(event.target.value));
                }}
              />
              <label>&nbsp;px</label>
            </NumberInputDiv>
            {deleteTd ? (
              <Fragment>
                <NumberInputDiv>
                  <label>&nbsp;W</label>
                  <InputNumberSlider
                    type="number"
                    min="10"
                    max={mailState.tableWidth}
                    size="3"
                    value={tdWidth}
                    onChange={(event) => {
                      setTdWidth(parseInt(event.target.value));
                    }}
                  />
                  <label>&nbsp;px</label>
                </NumberInputDiv>
              </Fragment>
            ) : null}
            <NumberInputDiv>
              <label>&nbsp;H&nbsp;</label>
              <InputNumberSlider
                ref={tdHeightInputRef}
                type="number"
                min="24"
                max="600"
                value={tdClass.height}
                onChange={(event) => {
                  setTdHeight(parseInt(event.target.value));
                }}
              />
              <label>&nbsp;px</label>
            </NumberInputDiv>
            <ColorPickerDiv className="input-group mb-3">
              배경색&nbsp;
              <ColorPickerInput
                type="color"
                class="form-control input-lg"
                onChange={(e) => {
                  setTdBgcolor(e.target.value);
                }}
              />
            </ColorPickerDiv>
          </Menus>
        ) : null}
        {image === null ? (
          <ContentWrapperP>{ReactHtmlParser(content)}</ContentWrapperP>
        ) : (
          <a href={`${image.link}`}>
            <img
              src={image.src}
              style={{
                width: "100%",
                height: `${tdHeight}px`,
                padding: 0,
                marign: 0,
                borderRadius: `${tdBorderRadius}px`
              }}
            />
          </a>
        )}
      </td>
    </Fragment>
  );
}

const MenuToggle = styled.button`
  position: absolute;
  background-color: #c9d6de;
  border-color: #c9d6de;
  width: 30px;
  height: 20px;
  padding: 0px;
  font-size: 2px;
  font-weight: 800;
  left: 5px;
  top: 5px;
`;
const Menus = styled.div`
  position: absolute;
  background: none;
  display: flex;
  flex-direction: column;
  min-width: 100px;
  left: 5px;
  top: 5px;
  background: #fbfbfb;
  box-shadow: 1px 1px 4px #6c757d, -1px -1px 4px #6c757d;
  border-radius: 5px;
  z-index: 500;
`;

const CloseButton = styled.button`
  display: flex;
  background-color: #eaeaea;
  border-color: #c9d6de;
  align-items: center;
  margin-top: 5px;
  margin-left: auto;
  margin-right: 5px;
  width: 1.5em;
  height: 1.5em;
  justify-content: center;
  font-weight: 800;
  border-radius: 5px;
  color: #52616a;
  padding: 3px;
`;
const EditButton = styled.button`
  box-shadow: 1px 1px 3px gray;
  background-color: #eaeaea;
  border-color: gray;
  border-left: solid 3px;
  border-top: none;
  border-bottom: none;
  border-right: none;
  color: #52616a;
  width: 90%;
  height: 30px;
  font-weight: 800;
  margin: 5px;
  font-size: 0.8em;
`;

const NumberInputDiv = styled.div`
  box-shadow: 1px 1px 3px gray;
  background-color: #eaeaea;
  border-color: gray;
  border-left: solid 3px;
  border-top: none;
  border-bottom: none;
  border-right: none;
  color: #52616a;
  width: 90%;
  height: 30px;
  padding: 0px;
  font-weight: 700;
  margin: 5px;

  input[type="number"] {
    margin: 1px;
    text-align: center;
    width: 40px;
    border-radius: 10px;
    color: #1e2022;
    background-color: #eaeaea;

    font-size: 0.8em;
    border: none;
    font-weight: 800;

    margin-top: 2px;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const ContentWrapperP = styled.p`
  margin: 0;
  p {
    margin: 0;
  }
`;
const ColorPickerDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 3px gray;
  background-color: #eaeaea;
  border-color: gray;
  border-left: solid 3px;
  border-top: none;
  border-bottom: none;
  border-right: none;
  color: #52616a;
  width: 90%;
  height: 30px;
  padding: 0px;
  margin: 5px;
  color: #52616a;
  font-size: 0.8em;
  font-weight: 800;
`;
const ColorPickerInput = styled.input`
  width: 20px;
`;
const InputNumberSlider = styled.input``;
=======
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
>>>>>>> e33387d2e735d6ed58b541a6d06e8faba0709a98
