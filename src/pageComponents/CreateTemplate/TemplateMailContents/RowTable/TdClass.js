import React, {
  useState,
  Fragment,
  useContext,
  useEffect,
  useRef,
} from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import CustomEditor from "../../../../components/CustomEditor";
import TdContent from "./TdClass/TdContent";
import { globalStateStore } from "../../../../stores/globalStateStore";
import { mailTemplateStore } from "../../../../stores/mailTemplateStore";
import CreateTemplate from "../../../../pages/CreateTemplate";
import TdMenus from "./TdClass/TdMenus";
export default function TdClass({
  rowIndex,
  colIndex,
  rowTableIndex,
  index,
  tdClass,
  deleteTd
}) {

// ===========================================================================================================
// ================== contexts =====================================================================================
// ============================================================================================================
  const globalState = useContext(globalStateStore);                                 // backState의 tableWidth(number),  
  const backState = globalState.state;                                              // tableHeight(number), boxShadow(boolean) 사용
  const backDispatch = globalState.dispatch;                                        // td의 width, height 변경시 backState 변경
  const _mailState = useContext(mailTemplateStore);                                 // mailState의 contents(Object[Map]) 사용
  const mailState = _mailState.state;                                             
  const mailDispatch = _mailState.dispatch;                                         // td변경시 mailState.contents 변경("UPDATE_CONTENTS")       
  const {saveTemplateInsert} = useContext(CreateTemplate.TemplateActionsContext);   // 현재의 mailTemplate 저장을 위한 함수 
  
  // ==================================  initialTdHeight =============================================== 
  // 분할된 박스이면 다른 height를 적용
  const initialTdHeight =
    colIndex !== undefined
      ? mailState.contents.body.contentRowTables[rowTableIndex].tdClasses[
          colIndex
        ][rowIndex].height
      : tdClass.height;




// ===========================================================================================================
// ==================  states =====================================================================================
// ============================================================================================================
  const [editStatus, setEditStatus] = useState(false);                                                               // boolean, CustomEditor(에디터) on&off를 위한 state
  const [menuToggleStatus, setMenuToggleStatus] = useState(false);                                                   // boolean, MenuToggle on&off를 위한 state
  const [menuStatus, setMenuStatus] = useState(false);                                                               // boolean, TdMenus on&off를 위한 state
  const [tdBgcolor, setTdBgcolor] = useState(tdClass.bgcolor);    // string, td의 배경색
  const [tdWidth, setTdWidth] = useState(tdClass.width);                                                             // number, td의 width
  const [tdHeight, setTdHeight] = useState(initialTdHeight);                                                         // number, td의 height
  const [content, setContent] = useState(tdClass.content);                                                           // string, "<p></p>" td의 content
  const [tdBorderRadius, setTdBorderRadius] = useState(tdClass.borderRadius);                                        // number, td의 borderRadius
  const [image, setImage] = useState(null);                                                                          // Object, {link:"",src=""}
  const [button, setButton] =useState(null);                                                                         // Object, {buttonConfig...}

  // padding
  const [tdPaddingLeft, setTdPaddingLeft] = useState(tdClass.paddingLeft);
  const [tdPaddingRight, setTdPaddingRight] = useState(tdClass.paddingRight);
  const [tdPaddingTop, setTdPaddingTop] = useState(tdClass.paddingTop);
  const [tdPaddingBottom, setTdPaddingBottom] = useState(tdClass.paddingBottom);
  


// ===========================================================================================================
// ==================  refs =====================================================================================
// ============================================================================================================
  const tdContentEditorRef = useRef(null);
  const tdContentImageRef = useRef(null);
  const tdContentButtonRef = useRef(null);
  const tdHeightInputRef = useRef(null);
  const tdRef = useRef(null);





// ===========================================================================================================
// ==================  useEffect =====================================================================================
// ============================================================================================================
  useEffect(() => {
    getImageSynk();     // td에 이미지가 있으면 setImage()
    getButtonSynk();    // td에 Button이 있으면 setButton()
    
    // Template의 td가 변동사항이 생길시 -------------------------------------------------------
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

    // boxShadow === false, 그림자가 없을경우, edit창 off
    if (backState.boxShadow === false) setEditStatus(false);
   
    // td 변경시, mailState.contents에 변경사항 기록
    const newContents = { ...mailState.contents };
    const commonContent = {
        bgcolor: tdBgcolor,
        width: tdWidth,
        height: tdHeight,
        content: content,
        borderRadius: tdBorderRadius,
        paddingLeft: tdPaddingLeft,
        paddingRight: tdPaddingRight,
        paddingTop: tdPaddingTop,
        paddingBottom: tdPaddingBottom
    }
    if (colIndex === undefined) {
      newContents.body.contentRowTables[rowTableIndex].tdClasses[index] = {
        ...tdClass,
        ...commonContent
      };
    } else {
      newContents.body.contentRowTables[rowTableIndex].tdClasses[colIndex][
        rowIndex
      ] = {
        ...tdClass,
        ...commonContent
      };
    }

    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents },
    });

// content, tdWidth, tdHeight, tdBorderRadius, tdBgcolor state값이 변경될시에 useEffect 수행
  }, [content, tdWidth, tdHeight, tdBorderRadius, tdBgcolor, tdPaddingLeft, tdPaddingRight, tdPaddingTop, tdPaddingBottom]);



  // =============================== tempStyle =======================================================
  // 테두리 ON(boxShadow===true)일때의 TD의 스타일
  const commonStyle = {
    boxSizing:"border-box",
    width: `${tdWidth}%`,
    height:`${tdHeight>60?tdHeight:60}px`,
    paddingLeft:`${tdPaddingLeft}px`,
    paddingRight:`${tdPaddingRight}px`,
    paddingTop:`${tdPaddingTop}px`,
    paddingBottom:`${tdPaddingBottom}px`,
    color: "black",
    tableLayout:'fixed',
    overflow:"hidden",
    backgroundColor: backState.boxShadow ? "#CDEDFD" : ""
  };

  if(colIndex !== undefined) {
    if(rowIndex>0) {
      commonStyle["width"] = "100%";
    }
  }

  const tdShadowStyle = {
    ...commonStyle,
    boxShadow: `1px 1px 0px 0px #B6DCFE inset, -1px -1px 0px 0px #B6DCFE inset`,
  };
  
  if(editStatus===true)  {
    tdShadowStyle["boxShadow"] = `1px 1px 0px 0px #582E60 inset, -1px -1px 0px 0px #582E60 inset`;
    tdShadowStyle["zIndex"] = 1000;
  }
    // 테두리 OFF(boxShaodw===false)일때의 TD의 스타일
  const tdNonShadowStyle = {
    ...commonStyle,
  };

  const tempTdStyle =
    backState.boxShadow === true ? tdShadowStyle : tdNonShadowStyle;
  
  const tdStyle =
    menuStatus === true || menuToggleStatus === true
      ? { ...tempTdStyle, position: "relative" }
      : { ...tempTdStyle, position: "block" }






// ===========================================================================================================
// ==================  functions =====================================================================================
// ============================================================================================================
// 이미지가 있을 경우 setImage()
// args = undefined
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

// button이 있을 경우 setButton()
// args = undefined
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




// ============================================================================================================
// ============================ handler ====================================================================================
// ============================================================================================================
// td클릭시, edit창 활성화
// args = undefined
const tdClickHandler = () => {
  setEditStatus(true);
}

// td mouse hover(over)시, toggle창 활성화
const tdMouseOverHandler = () => {
  setMenuToggleStatus(true);
}

// td mouse leave시, toggle창 비활성화
const tdMouseLeaveHandler = () => {
  setMenuToggleStatus(false);
}

// MenueToggle 클릭시, TdMenus 활성화
const menuToggleClickHandler = () => {
  setMenuStatus(true);
  setEditStatus(false);
  setMenuToggleStatus(false);
}

// TdOverlay 클릭시, edit창 비활성화
const tdOverlayClickHandler = () => {
  setEditStatus(false);
  setMenuToggleStatus(false);
}





// ============================================================================================================
// ============================ HTML ====================================================================================
// ============================================================================================================
  return (
    <Fragment>
      <td
        ref={tdRef}
        // bgcolor={tdBgcolor}
        style={tdStyle}
        // height={tdHeight>60?tdHeight:60}
        onClick={tdClickHandler}
        onMouseOver={tdMouseOverHandler}
        onMouseLeave={tdMouseLeaveHandler}
      >
        {backState.boxShadow&&menuToggleStatus? (
          <MenuToggle
            width={tdWidth}
            height={tdHeight}
            className="btn btn-primary"
            onClick={menuToggleClickHandler}
          >
            ⚈⚈⚈
          </MenuToggle>
        ) : null}

        {menuStatus === true && backState.boxShadow === true ? (
          <TdMenus
            tdRef={tdRef} tdHeightInputRef={tdHeightInputRef}
            rowIndex={rowIndex} colIndex={colIndex} rowTableIndex={rowTableIndex} index={index}
            deleteTd={deleteTd}
            mailState={mailState} mailDispatch={mailDispatch}
            setMenuStatus={setMenuStatus} setMenuToggleStatus={setMenuToggleStatus} setEditStatus={setEditStatus}
            saveTemplateInsert={saveTemplateInsert}
            setImage={setImage} image={image} button={button} setButton={setButton} setContent={setContent}
            getImageSynk={getImageSynk}
            tdBorderRadius={tdBorderRadius} setTdBorderRadius={setTdBorderRadius}
            tdWidth={tdWidth} setTdWidth={setTdWidth}
            tdHeight={tdHeight} setTdHeight={setTdHeight}
            tdBgcolor={tdBgcolor} setTdBgcolor={setTdBgcolor}
            tdPaddingLeft={tdPaddingLeft} tdPaddingRight={tdPaddingRight} tdPaddingTop={tdPaddingTop} tdPaddingBottom={tdPaddingBottom}
            setTdPaddingLeft={setTdPaddingLeft} setTdPaddingRight={setTdPaddingRight} setTdPaddingTop={setTdPaddingTop} setTdPaddingBottom={setTdPaddingBottom}
          />
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
            tdBgcolor={tdBgcolor}
            tdBorderRadius={tdBorderRadius}
          />
        ) :
        button === null ?
          <TdContent ref={tdContentImageRef} image={image} width={tdWidth} height={tdHeight} content={content} borderRadius={tdBorderRadius} backgroundColor={tdBgcolor} />
        : 
        <TdContent ref={tdContentButtonRef} button={button} width={tdWidth} height={tdHeight} content={content} borderRadius={tdBorderRadius} backgroundColor={tdBgcolor} />
        }
      </td>
      {editStatus===true?
      <TdOverlayDiv onClick={tdOverlayClickHandler}>&nbsp;</TdOverlayDiv>
      :null}
    </Fragment>
  );
}





// ============================================================================================================
// ============================ CSS ====================================================================================
// ============================================================================================================




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

