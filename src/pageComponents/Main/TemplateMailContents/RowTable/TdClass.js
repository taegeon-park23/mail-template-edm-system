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
  header,
  footer,
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

  const [editModalStatus, setEditModalStatus] = useState(false);
  const [imageModalStatus, setImageModalStatus] = useState(false);
  const [menuToggleStatus, setMenuToggleStatus] = useState(false);
  const [menuStatus, setMenuStatus] = useState(false);
  const [tdBgcolor, setTdBgcolor] = useState(tdClass.bgcolor);
  const [tdWidth, setTdWidth] = useState(tdClass.width);
  const [tdHeight, setTdHeight] = useState(firstTdClass.height);
  const [content, setContent] = useState(tdClass.content);
  const [tdBorderRadius, setTdBorderRadius] = useState(tdClass.borderRadius);
  const [image, setImage] = useState(null);

  const tdHeightInputRef = useRef(null);
  const tdRef = useRef(null);
  useEffect(() => {
    const newContents = { ...mailState.contents };
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
        height={
          mailState.contents.body.contentRowTables[rowTableIndex].tdClasses[0]
            .height
        }
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
                  deleteTd(index);
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
                value={tdHeight}
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
