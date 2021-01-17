import React, {
  useState,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import styled from "styled-components";
import Modal from "../../../../components/Modal";
import AddImageModal from "../../../../components/AddImageModal";
import CustomEditor from "../../../../components/CustomEditor";
import TdContent from "./TdClass/TdContent";
import { globalStateStore } from "../../../../stores/globalStateStore";
import { mailTemplateStore } from "../../../../stores/mailTemplateStore";
import AddButtonModal from "./TdClass/AddButtonModal";
export default function TdClass({
  rowIndex,
  colIndex,
  rowTableIndex,
  index,
  tdClass,
  deleteTd,
}) {

  // ================================== stores ===============================================
  const globalState = useContext(globalStateStore);
  const backState = globalState.state;
  const backDispatch = globalState.dispatch;
  const _mailState = useContext(mailTemplateStore);
  const mailState = _mailState.state;
  const mailDispatch = _mailState.dispatch;

    // ==================================  initialTdHeight =============================================== 
    // 분할된 박스이면 다른 height를 적용
  const initialTdHeight =
    colIndex !== undefined
      ? mailState.contents.body.contentRowTables[rowTableIndex].tdClasses[
          colIndex
        ][rowIndex].height
      : tdClass.height;


    // ================================== states ===============================================
  const [editStatus, setEditStatus] = useState(false);
  const [imageModalStatus, setImageModalStatus] = useState(false);
  const [buttonModalStatus, setButtonModalStatus] = useState(false);
  const [menuToggleStatus, setMenuToggleStatus] = useState(false);
  const [menuStatus, setMenuStatus] = useState(false);
  const [tdBgcolor, setTdBgcolor] = useState(tdClass.bgcolor);
  const [tdWidth, setTdWidth] = useState(tdClass.width);
  const [tdHeight, setTdHeight] = useState(initialTdHeight);
  const [content, setContent] = useState(tdClass.content);
  const [tdBorderRadius, setTdBorderRadius] = useState(tdClass.borderRadius);
  const [image, setImage] = useState(null);
  const [button, setButton] =useState(null);
  
  const tdHeightInputRef = useRef(null);
  const tdRef = useRef(null);

  useEffect(() => {
    const templateMailContentsTableDoc = document.getElementById(
      "TemplateMailContentsTable"
    );
    // Template Table의 Resize 생길시 변동 사항 dispatch
    if (
      templateMailContentsTableDoc.offsetWidth !== backState.tableWidth ||
      templateMailContentsTableDoc.offsetHeight !== backState.tableHeight
    ) {
      backDispatch({
        type: "TABLE_RESIZE",
        value: {
          tableWidth: templateMailContentsTableDoc.offsetWidth,
          tableHeight: templateMailContentsTableDoc.offsetHeight,
        },
      });
    }

    if (backState.boxShadow === false) setEditStatus(false);
    const newContents = { ...mailState.contents };
    if (colIndex === undefined) {
      newContents.body.contentRowTables[rowTableIndex].tdClasses[index] = {
        ...tdClass,
        bgcolor: tdBgcolor,
        width: tdWidth,
        height: tdHeight,
        content: content,
        borderRadius: tdBorderRadius,
      };
    } else {
      newContents.body.contentRowTables[rowTableIndex].tdClasses[colIndex][
        rowIndex
      ] = {
        ...tdClass,
        bgcolor: tdBgcolor,
        width: tdWidth,
        height: tdHeight,
        content: content,
        borderRadius: tdBorderRadius,
      };
    }
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents },
    });
  }, [content, tdWidth, tdHeight, tdBorderRadius, tdBgcolor]);

  // 테두리 ON(boxShadow===true)일때의 TD의 스타일
  const tdShadowStyle = {
    boxShadow: "0.5px 0.5px 1px #4e73df inset, -0.5px -0.5px 1px #4e73df inset",
    backgroundColor: { tdBgcolor },
    borderRadius: `${tdBorderRadius}px`,
    color: "black",
  };
  
  if(editStatus===true)  {
    tdShadowStyle["boxShadow"] = "1px 1px 3px #6610f2, -1px -1px 3px #6610f2";
    tdShadowStyle["zIndex"] = 1000;
  }
    // 테두리 OFF(boxShaodw===false)일때의 TD의 스타일
  const tdNonShadowStyle = {
    backgroundColor: { tdBgcolor },
    borderRadius: `${tdBorderRadius}px`,
    color: "black"
  };

  const tempTdStyle =
    backState.boxShadow === true ? tdShadowStyle : tdNonShadowStyle;
  
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
      
      <td
        ref={tdRef}
        bgcolor={tdBgcolor}
        style={tdStyle}
        width={tdWidth}
        height={tdHeight}
        onClick={(e) => {
            setEditStatus(true);
        }}
        onMouseOver={() => {
          setMenuToggleStatus(true);
          
        }}
        onMouseLeave={(e) => {
          setMenuToggleStatus(false);
        }}
      >
        {menuToggleStatus === true && backState.boxShadow === true ? (
          <MenuToggle
            width={tdWidth}
            height={tdHeight}
            className="btn btn-primary"
            onClick={() => {
              setMenuStatus(true);
            }}
          >
            ⚈⚈⚈
          </MenuToggle>
        ) : null}
        {menuStatus === true && backState.boxShadow === true ? (
          <Fragment>

{/* ============================== Menus =============================================================== */}
          <MenusOvelay onClick={()=>{setMenuStatus(false)}}>&nbsp;</MenusOvelay>
          <Menus className="d-flex align-items-center bg-dark" height={tdHeight}>
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
                const tdClassIndex = colIndex !== undefined ? colIndex : index;
                const newContents = mailState.contents;
                const newContentRowTalbes = newContents.body.contentRowTables;
                const newTdClass =
                  newContentRowTalbes[rowTableIndex].tdClasses[tdClassIndex];
                if (colIndex !== undefined) {
                  newTdClass.push(newTdClass[rowIndex]);
                } else {
                  newContentRowTalbes[rowTableIndex].tdClasses[tdClassIndex] = [
                    newTdClass,
                    newTdClass,
                  ];
                }
                mailDispatch({
                  type: "UPDATE_CONTENTS",
                  value: {
                    contents: newContents,
                    version: mailState.version + 1,
                  },
                });
              }}
            >
              <span>박스분할</span>
            </EditButton>
            <EditButton
              className="btn btn-primary"
              onClick={() => {
                setTdBgcolor("");
                setImage(null);
                setButton(null);
                setContent(`<p style="margin:0px;"></p>`);
              }}
            >
              <span>여백전환</span>
            </EditButton>
            <EditButton
              className="btn btn-primary"
              onClick={() => {
                setButtonModalStatus(!buttonModalStatus);
              }}
            >
              <span>버튼</span>
            </EditButton>
            {buttonModalStatus === true ?
            <AddButtonModal 
              tdWidth={tdWidth} tdHeight={tdHeight}
              setButton={setButton} button={button} setContent={setContent}/>
             : null}
            <EditButton
              className="btn btn-primary"
              onClick={() => {
                setImageModalStatus(!imageModalStatus);
              }}
            >
              <span>이미지</span>
            </EditButton>
            {imageModalStatus === true ? (
            <AddImageModal
              onlySrc={true}
              image={image}
              synkEditorToResult={(image) => {
                const newContent = `<a href="${image.link}"}><img src="${image.src}" alt="image" style=' width: 100% height: 100%; border-radius: ${tdBorderRadius}px; background-color: none'/></a>`
                setImage(image);
                setContent(newContent);
              }}
            />
            ) : null}
            {deleteTd ? (
              <EditButton
                className="btn btn-primary"
                onClick={() => {
                  // 분할된 박스인지 구별
                  if(colIndex !== undefined) {
                    const newContents = {...mailState.contents};
                    let tdClassArr = newContents.body.contentRowTables[rowTableIndex].tdClasses[colIndex];
                    // 분할된 박스라면 배열 타입, length가 한개라면 해당 Index만 삭제하면 끝
                    if(tdClassArr.length === 1) deleteTd(colIndex);
                    // 해당 rowIndex가 마지막이라면 pop 수행
                    else {
                      if(tdClassArr.length-1 === rowIndex) {
                        tdClassArr.pop();
                      } else {
                        newContents.body.contentRowTables[rowTableIndex].tdClasses[colIndex] = 
                          tdClassArr.slice(0, rowIndex).concat(tdClassArr.slice(rowIndex+1, tdClassArr.length));
                      }
                      mailDispatch({type:"UPDATE_CONTENTS", value:{contents: newContents, version: mailState.version+1}});
                    }
                  } else {
                    deleteTd(index);
                  }
                }}
              >
                <span role="img" aria-label="img">
                  박스 삭제
                </span>
              </EditButton>
            ) : null}
             <InputDiv>
             <div  className="input-group mb-3">
             <div className="input-group-prepend">
                    <span className="input-group-text">br</span>
                </div>
              <InputNumberSlider
                type="number"
                className="form-control"
                min="0"
                max={1000}
                size="3"
                value={tdBorderRadius}
                onChange={(event) => {
                  setTdBorderRadius(parseInt(event.target.value));
                }}
              />
              <div className="input-group-prepend">
                    <span className="input-group-text">W</span>
                </div>
                <InputNumberSlider
                className="form-control"
                  type="number"
                  min="10"
                  max={mailState.tableWidth}
                  size="3"
                  value={tdWidth}
                  onChange={(event) => {
                    setTdWidth(parseInt(event.target.value));
                  }}
                />
                <div className="input-group-prepend">
                    <span className="input-group-text">H</span>
                </div>
              <InputNumberSlider
                ref={tdHeightInputRef}
                type="number"
                min="24"
                className="form-control"
                max="600"
                value={tdHeight}
                onChange={(event) => {
                  setTdHeight(parseInt(event.target.value));
                }}
              />
              <div className="input-group-prepend">
                    <span className="input-group-text">배경</span>
                </div>
              <ColorPickerInput
                type="color"
                className="form-control"
                value={tdBgcolor}
                onChange={(e) => {
                  setTdBgcolor(e.target.value);
                }}
              />
              </div>
            </InputDiv>
            

          </Menus>
          </Fragment>
        ) : null}


{/* ============================== Content ============================== */}
        {editStatus === true && image === null && button === null ? (
          <CustomEditor
            data={`${content}`}
            onChangeHandler={(event, editor) => {
              setContent(editor.getData());
            }}
            onBlurHandler={() => {}}
            onFocusHnadler={() => {}}
          />
        ) :
        button === null ?
          <TdContent image={image} width={tdWidth} height={tdHeight} content={content} borderRadius={tdBorderRadius} />
        : 
        <TdContent button={button} width={tdWidth} height={tdHeight} content={button.result} borderRadius={tdBorderRadius} />
        }
      </td>
      {editStatus===true?
      <TdOverlayDiv onClick={()=>{
          setEditStatus(false);}}>&nbsp;</TdOverlayDiv>
      :null}
    </Fragment>
  );
}

const TdOverlayDiv = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  opacity: 50%;
  top:0;
  left: 0;
`;

const MenuToggle = styled.button`
  position: absolute;
  background-color: #c9d6de;
  border-color: #c9d6de;
  width: 30px;
  height: 20px;
  padding: 0px;
  font-size: 2px;
  font-weight: 800;
  z-index:499;
  left: ${(props) => {
    if (props.width < 20) return -5;
    else return 5;
  }}px;
  top: ${(props) => {
    if (props.height < 20) return -5;
    else return 5;
  }}px;
`;

const MenusOvelay = styled.div`
  width:100vw;
  height:100vh;
  background: none;
  top:0px;
  left:0px;
  position: fixed;
  z-index:499;
`;
const Menus = styled.div`
  position: fixed;
  height: 100vh;
  background: none;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  top: 0px;
  right: 5px;
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
  margin-left: 5px;
  margin-right: auto;
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

const InputDiv = styled.div`
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const ColorPickerInput = styled.input`
  width: 20px;
`;
const InputNumberSlider = styled.input``;
