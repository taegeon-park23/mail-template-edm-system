import React, {
  useState,
  Fragment,
} from "react";

import ReactDOM from "react-dom";
import styled from "styled-components";
import AddImageModal from "../../../../../components/AddImageModal";
import { storageRef } from "../../../../../components/Firebase";
import AddButtonModal from "./AddButtonModal";

export default function TdMenus({
  tdRef,                    // Object, {current...}
  tdHeightInputRef,         // Object, {current...}
  rowIndex,                 // number
  colIndex,                 // number
  rowTableIndex,            // number
  index,                    // number
  deleteTd,                 // function, args=index(number)
  mailState,                // {}, object Map
  mailDispatch,             // function, args={"type":"", value:{}}
  setMenuStatus,            // function, args=status(boolean)
  setMenuToggleStatus,      // function, args=status(boolean)
  setEditStatus,            // function, args=status(boolean)
  saveTemplateInsert,       // function, args=undefined
  setImage,                 // function, args={link:"", src:""}
  image,                    // object, {link:"", src=""}
  button,                   // object, {buttonConfig...}
  setButton,                // function, args={buttonConfig:{}, link:""}
  setContent,               // function, args="<p></p>"(string)
  getImageSynk,             // function, args=undefined
  tdBorderRadius,           // number
  setTdBorderRadius,        // function, args=br(number)
  tdWidth,                  // number
  setTdWidth,               // function, args=width(number)
  tdHeight,                 // number
  setTdHeight,              // function, args=height(number)
  tdBgcolor,                // string
  setTdBgcolor,             // function, args=bgcolor("string")
  tdPaddingLeft,            // number
  tdPaddingRight,           // number
  tdPaddingTop,             // number
  tdPaddingBottom,          // number
  setTdPaddingLeft,         // function, args=tdPaddingLeft(number)
  setTdPaddingRight,        // function, args=tdPaddingRight(number)
  setTdPaddingTop,          // function, args=tdPaddingTop(number)
  setTdPaddingBottom        // function, args=tdPaddingBottom(number)
}) {

// ============================================================================================================
// ==================  states =====================================================================================
// ============================================================================================================
const [buttonModalStatus, setButtonModalStatus] = useState(false);      // boolean, AddButtonModal(Button모달) on&off를 위한 state 
const [imageModalStatus, setImageModalStatus] = useState(false);        // boolean, AddImageModal(Image모달) on&off를 위한 state






// ============================================================================================================
// ============================ functions ====================================================================================
// ============================================================================================================

// dataURL을 파일로 변환
// args = dataurl(string[Blob:imgae]), fileName(String)
// return = new File([u8arr], fileName, { type: mime });
const dataURLtoFile = (dataurl, fileName) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
};

// editor를 동기화하여 결과로 변환
// args = image(object, {link:"", src:""}), fileName(string)
// return = undefined
const synkEditorToResult = (image) => {
  if (mailState.number === 0) {
    alert("이미지를 업로드하기 위해서는 먼저 저장해주세요");
    return;
  }

  // 현재 tplId
  const templateId = mailState.number;

  let templateImageName = "";
  // 현재 tdClass가 column이 여러개인지 아닌지를 판별하여 image 이름을 설정.
  if (colIndex !== undefined) {
    templateImageName = `${rowTableIndex}:${colIndex}-${rowIndex}.png`;
  } else {
    templateImageName = `${rowTableIndex}:${index}.png`;
  }

  // 뒤의 Date는 이미지를 다시 불러오기 위함
  let tmpSrc = `https://firebasestorage.googleapis.com/v0/b/bizdem-c4931.appspot.com/o/images%2F${templateId}%2F${templateImageName}?alt=media&time=${new Date().getTime()}`;
  const newContent = `<a id="link-id" href="${image.link}"}><img id="image-id" src="${tmpSrc}" alt='${templateImageName}' style=' width: 100% height: 100%; border-radius: ${tdBorderRadius}px; background-color: none'/></a>`;
  // 이미지를 스토리지에 저장하기 위해 파일로 변환
  const imageFile = dataURLtoFile(`${image.src}`, templateImageName);

  // firebase storage에 이미지 저장.
  storageRef
    .child(`images/${templateId}/${templateImageName}`)
    .put(imageFile)
    .then(() => {
      setImage(image);
    })
    .then(() => {
      setTimeout(() => {
        // 현재 템플릿 상태를 데이버테이스에 저장
        saveTemplateInsert();
      }, 1000);
    })
    .then(() => {
        // 바뀐 이미지를 다시 불러오기
      setContent(newContent);
    });
};





// ============================================================================================================
// ============================ handler ====================================================================================
// ============================================================================================================

// 버튼모달 종료
 const menusOverlayHandler = () => {
    setMenuStatus(false);
    setMenuToggleStatus(false);
    setEditStatus(false);
 }

// 버튼모달 종료
 const closeButtonHandler = () => {
    setMenuStatus(false);
    setMenuToggleStatus(false);
    setEditStatus(false);
 }

 // 박스 분할
 const editButtonForDivideBoxHandler = () => {
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
 }

 // 여백전환
 const editButtonForWhiteSpaceHandler = () => {
    setTdBgcolor("");
    const imgs = ReactDOM.findDOMNode(tdRef.current).querySelectorAll(
      "img"
    );
    if (imgs) {
      imgs.forEach((img) => {
        var desertRef = storageRef.child(
          `images/${mailState.number}/${img.alt}`
        );
        desertRef
          .delete()
          .then(function () {
            alert("이미지가 삭제되었습니다.");
          })
          .catch(function (error) {
            alert("이미지를 삭제할 수 없습니다.");
          });
      });
      setTimeout(() => {
        saveTemplateInsert();
      }, 1000);
    }
    setImage(null);
    setButton(null);
    setContent(`<p style="margin:0px;"></p>`);
 }
 
 // 버튼
 const editButtonForButtonHanlder = () => {
    setTdBgcolor("");
    setButtonModalStatus(!buttonModalStatus);
 }

 // 이미지
 const editButtonForImage = () => {
    setTdBgcolor("");
    getImageSynk();
    setImageModalStatus(!imageModalStatus);
 }
 
 // 박스 삭제
 const editButtonForDeleteBox = () => {
    // 현재 박스가 분할된 박스인지를 판별, colIndex !== undefined이면 분할된 박스
    if (colIndex !== undefined) {
        const newContents = { ...mailState.contents };
        let tdClassArr =
          newContents.body.contentRowTables[rowTableIndex].tdClasses[
            colIndex
          ];
        // 분할된 박스라면 배열 타입, length가 한개라면 해당 Index만 삭제하면 끝
        if (tdClassArr.length === 1) deleteTd(colIndex);
        // 해당 rowIndex가 마지막이라면 pop 수행
        else {
          if (tdClassArr.length - 1 === rowIndex) {
            tdClassArr.pop();
          } else {
            newContents.body.contentRowTables[rowTableIndex].tdClasses[
              colIndex
            ] = tdClassArr
              .slice(0, rowIndex)
              .concat(
                tdClassArr.slice(rowIndex + 1, tdClassArr.length)
              );
          }
          mailDispatch({
            type: "UPDATE_CONTENTS",
            value: {
              contents: newContents,
              version: mailState.version + 1,
            },
          });
        }
      } else {
        // 박스 삭제한 결과를 렌더링
        deleteTd(index);
      }
 }

 // br
 // 박스 선 radius
 // args = event(ChangeEvent)
 const InputNumberSliderForBorderRadiusHandler = (event) => {
    setTdBorderRadius(parseInt(event.target.value));
 }

 // W
 // 박스 width
 // args = event(ChangeEvent)
 const InputNumberSliderForTdWidthHandler = (event) => {
    if(rowIndex>0) {
      return;
    }
    setTdWidth(parseInt(event.target.value));
 }

 // H
 // 박스 Height
 // args = event(ChangeEvent)
 const InputNumberSliderForTdHeightHandler = (event) => {
    setTdHeight(parseInt(event.target.value));
 }

 // 배경
 // 박스 배경 컬러
 // args = event(ChangeEvent)
 const InputNumberSliderForTdBgcolorHandler = (event) => {
    setTdBgcolor(event.target.value);
 }

 // padding
 // 박스 paddingLeft 지정
 // args = event(ChangeEvent) 
 const InputNumberSliderForTdPaddingLeftHandler = (event) => {
   setTdPaddingLeft(event.target.value);
 }

 // 박스 paddingRight 지정
 // args = event(ChangeEvent) 
 const InputNumberSliderForTdPaddingRightHandler = (event) => {
  setTdPaddingRight(event.target.value);
}

// 박스 paddingTop 지정
 // args = event(ChangeEvent) 
 const InputNumberSliderForTdPaddingTopHandler = (event) => {
  setTdPaddingTop(event.target.value);
}

// 박스 paddingBottom 지정
 // args = event(ChangeEvent) 
 const InputNumberSliderForTdPaddingBottomHandler = (event) => {
  setTdPaddingBottom(event.target.value);
}


// ============================================================================================================
// ============================ HTML ====================================================================================
// ============================================================================================================
   return (
    <Fragment>
      <MenusOvelay onClick={menusOverlayHandler}> &nbsp; </MenusOvelay>
      <Menus className="d-flex align-items-center" height={tdHeight}>
        <CloseButton className="btn btn-warning" onClick={closeButtonHandler}>
          <span>×</span>
        </CloseButton>
        <InputDiv>
          <div className="container-fluid input-group  ">
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
              onChange={InputNumberSliderForBorderRadiusHandler}
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
              onChange={InputNumberSliderForTdWidthHandler}
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
              onChange={InputNumberSliderForTdHeightHandler}
            />
            <div className="input-group-prepend">
              <span className="input-group-text">배경</span>
            </div>
            <ColorPickerInput
              type="color"
              className="form-control"
              value={tdBgcolor}
              onChange={InputNumberSliderForTdBgcolorHandler}
            />
          </div>
        </InputDiv>
        <InputDiv>
          <div className="input-group ">
            <div className="input-group-prepend">
              <span className="input-group-text">pl</span>
            </div>
            <InputNumberSlider
              type="number"
              className="form-control"
              min="0"
              max={1000}
              size="3"
              value={tdPaddingLeft}
              onChange={InputNumberSliderForTdPaddingLeftHandler}
            />
            <div className="input-group-prepend">
              <span className="input-group-text">pr</span>
            </div>
            <InputNumberSlider
              type="number"
              className="form-control"
              min="0"
              max={1000}
              size="3"
              value={tdPaddingRight}
              onChange={InputNumberSliderForTdPaddingRightHandler}
            />
            <div className="input-group-prepend">
              <span className="input-group-text">pt</span>
            </div>
            <InputNumberSlider
              type="number"
              className="form-control"
              min="0"
              max={1000}
              size="3"
              value={tdPaddingTop}
              onChange={InputNumberSliderForTdPaddingTopHandler}
            />
            <div className="input-group-prepend">
              <span className="input-group-text">pb</span>
            </div>
            <InputNumberSlider
              type="number"
              className="form-control"
              min="0"
              max={1000}
              size="3"
              value={tdPaddingBottom}
              onChange={InputNumberSliderForTdPaddingBottomHandler}
            />
          </div>
        </InputDiv>
        <ButtonsDiv>
        <EditButton className="btn btn-primary" onClick={editButtonForDivideBoxHandler}>
          <span>박스분할</span>
        </EditButton>
        
        <EditButton className="btn btn-primary"
          onClick={editButtonForWhiteSpaceHandler}
        >
          <span>여백전환</span>
        </EditButton>
        
        <EditButton className="btn btn-primary" 
            onClick={editButtonForButtonHanlder}>
          <span>버튼</span>
        </EditButton>
        
        {buttonModalStatus === true ? (
          <AddButtonModal
            tdWidth={tdWidth}
            tdHeight={tdHeight}
            setButton={setButton}
            button={button}
            setContent={setContent}
          />
        ) : null}
        
        <EditButton className="btn btn-primary"
          onClick={editButtonForImage}
        >
          <span>이미지</span>
        </EditButton>

        {imageModalStatus === true ? (
          <AddImageModal
            onlySrc={true}
            image={image}
            synkEditorToResult={synkEditorToResult}
          />
        ) : null}

        {deleteTd ? (
          <EditButton
            className="btn btn-primary"
            onClick={editButtonForDeleteBox}
          >
            <span role="img" aria-label="img">
              박스 삭제
            </span>
          </EditButton>
        ) : null}
      </ButtonsDiv>
        
      </Menus>
    </Fragment>
  );
}





// ============================================================================================================
// ============================ CSS ====================================================================================
// ============================================================================================================

const MenusOvelay = styled.div`
  width: 100vw;
  height: 100vh;
  background: none;
  top: 0px;
  left: 0px;
  position: fixed;
  z-index: 499;
`;
const Menus = styled.div`
  position: fixed;
  width: 500px;
  height: 100vh;
  background: none;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  top: 0px;
  right: 5px;
  background-color: rgba( 77, 163, 255, 0.85 );
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
  background-color: #0E8DFB;
  border: 5px solid white;
  color: #FFFFFF;
  width: 100%;
  height: 40px;
  font-weight: 800;
  font-size: 0.8em;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const InputDiv = styled.div`
border-radius: 10px;
display: flex;
align-items: center;
background-color: #FFFFFF;
padding: 5px;
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  margin: 10px;
`;

const ButtonsDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  padding: 10px;
`;

const ColorPickerInput = styled.input`
  width: 20px;
`;
const InputNumberSlider = styled.input`
  margin-right: 3px;
  border-radius: 5px;
`;