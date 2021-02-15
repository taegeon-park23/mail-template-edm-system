import React, {
  useState,
  Fragment,
  useContext,
  useEffect,
  useRef,
} from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import AddImageModal from "../../../../components/AddImageModal";
import CustomEditor from "../../../../components/CustomEditor";
import TdContent from "./TdClass/TdContent";
import { globalStateStore } from "../../../../stores/globalStateStore";
import { mailTemplateStore } from "../../../../stores/mailTemplateStore";
import AddButtonModal from "./TdClass/AddButtonModal";
import {storageRef} from "../../../../components/Firebase";
import CreateTemplate from "../../../../pages/CreateTemplate";
export default function TdClass({
  rowIndex,
  colIndex,
  rowTableIndex,
  index,
  tdClass,
  deleteTd
}) {

  // ================================== stores ===============================================
  const globalState = useContext(globalStateStore);
  const backState = globalState.state;
  const backDispatch = globalState.dispatch;
  const _mailState = useContext(mailTemplateStore);
  const mailState = _mailState.state;
  const mailDispatch = _mailState.dispatch;
  const {saveTemplateInsert, history} = useContext(CreateTemplate.TemplateActionsContext);
  
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

  


 // ================================== refs ===============================================

  const tdContentEditorRef = useRef(null);
  const tdContentImageRef = useRef(null);
  const tdContentButtonRef = useRef(null);
  const tdHeightInputRef = useRef(null);
  const tdRef = useRef(null);


  // ==================================== useEffect ==========================================================


  useEffect(() => {

    getImageSynk();
    getButtonSynk();

    // Template 중 TD가 변동사항이 생길시 -------------------------------------------------------
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



  // =============================== tempStyle =======================================================

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
      : { ...tempTdStyle, position: "block" }


// ===========================  functions =======================================================

const getImageSynk = () => {
  // Template 중 TD button, image 동기화
if(tdRef.current && image === null) {
  const dom = ReactDOM.findDOMNode(tdRef.current);
  const aDom = dom.getElementsByTagName('a');
  const imgDom = dom.getElementsByTagName('img');
  
    if(aDom && imgDom && aDom.length>0 && imgDom.length>0) {
      const imageConfig = {link: aDom[0].href, src:imgDom[0].src};
      setImage(imageConfig);
    }
  }
}

const getButtonSynk = () => {
  if(tdRef.current && button === null) {
    const dom = ReactDOM.findDOMNode(tdRef.current);
    const aDom = dom.getElementsByClassName('forsignup');
    if(aDom.length>0) {
      const buttonDom = aDom[0].children[0];
      const fontDom = buttonDom.children[0];
      const buttonConfig = {
        link: aDom[0].href, 
        color:fontDom.color,
        bgcolor:(buttonDom.style.backgroundColor),
        borderRadius:parseInt(buttonDom.style.borderRadius),
        width:parseInt(buttonDom.style.width),
        height:parseInt(buttonDom.style.lineHeight),
        content:fontDom.innerText,
      };
      setButton(buttonConfig);
    }
  }
}

// ====================================================== html ====================================================
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
                  const imgs = ReactDOM.findDOMNode(tdRef.current).querySelectorAll('img');
                  if(imgs) {
                  imgs.forEach(img => { 
                      var desertRef = storageRef.child(`images/${mailState.number}/${img.alt}`);
                      desertRef.delete().then(function() {
                       alert("이미지가 삭제되었습니다.");
                      }).catch(function(error) {
                        alert("이미지를 삭제할 수 없습니다.");
                      });
                    });
                    setTimeout(()=>{
                      saveTemplateInsert();
                      history.go(0);
                    }, 1000)
                  }
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
                setTdBgcolor("");
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
                setTdBgcolor("");
                getImageSynk();
                setImageModalStatus(!imageModalStatus);
              }}
            >
              <span>이미지</span>
            </EditButton>
            {imageModalStatus === true ? (
            <AddImageModal
              onlySrc={true}
              image={image}
              synkEditorToResult={(image) =>{
              if(mailState.number === 0) {
                alert("이미지를 업로드하기 위해서는 먼저 저장해주세요"); return;
              }
                const templateId = mailState.number;
                let templateImageName = "";
                if(colIndex !== undefined) {
                  templateImageName = `${rowTableIndex}:${colIndex}-${rowIndex}.png`;
                } else {
                  templateImageName = `${rowTableIndex}:${index}.png`;
                }

                let tmpSrc = `https://firebasestorage.googleapis.com/v0/b/bizdem-c4931.appspot.com/o/images%2F${templateId}%2F${templateImageName}?alt=media&time=${(new Date()).getTime()}`;
                const newContent = `<a id="link-id" href="${image.link}"}><img id="image-id" src="${tmpSrc}" alt='${templateImageName}' style=' width: 100% height: 100%; border-radius: ${tdBorderRadius}px; background-color: none'/></a>`
                
                let dataURLtoFile = (dataurl, fileName) => {
                  let arr = dataurl.split(","),
                  mime = arr[0].match(/:(.*?);/)[1],
                  bstr = atob(arr[1]), 
                  n = bstr.length, 
                  u8arr = new Uint8Array(n);
                  while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                  }

                  return new File([u8arr], fileName, {type:mime});
                }

                const imageFile = 
                dataURLtoFile(`${image.src}`, templateImageName);
                storageRef.child(`images/${templateId}/${templateImageName}`).put(imageFile)
                  .then(()=>{
                    setImage(image);})
                  .then(()=>{setTimeout(()=>{
                      saveTemplateInsert();
                  }, 1000)})
                  .then(()=>{setContent(newContent)});
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
            ref={tdContentEditorRef}
            data={`${content}`}
            onChangeHandler={(event, editor) => {
              setContent(editor.getData());
            }}
            onBlurHandler={() => {}}
            onFocusHnadler={() => {}}
          />
        ) :
        button === null ?
          <TdContent ref={tdContentImageRef} image={image} width={tdWidth} height={tdHeight} content={content} borderRadius={tdBorderRadius} />
        : 
        <TdContent ref={tdContentButtonRef} button={button} width={tdWidth} height={tdHeight} content={content} borderRadius={tdBorderRadius} />
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
