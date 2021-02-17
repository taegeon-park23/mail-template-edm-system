import React, { Fragment, useContext, useRef, useState } from "react";
import styled, { css } from "styled-components";

//components
import { ReactComponent as scrollImageSVG } from "../../../assets/icons/scroll.svg";
import TdClass from "./RowTable/TdClass";


import { globalStateStore } from "../../../stores/globalStateStore";
import { mailTemplateStore } from "../../../stores/mailTemplateStore";
const RowTable = ({ tdClasses, rowTableIndex, deleteRowTable }) => {
// ===========================================================================================================
// ================== contexts =====================================================================================
// ============================================================================================================
  const globalState = useContext(globalStateStore);            // backState의 baxShadow(boolean) 사용
  const { state } = globalState;  
  const mailGlobalState = useContext(mailTemplateStore);       // mailState의 contents(Object[Map]),
  const mailState = mailGlobalState.state;                     // version(number) <-rerendeing을 위한 state->
  const mailDispatch = mailGlobalState.dispatch;




// ===========================================================================================================
// ================== states =====================================================================================
// ============================================================================================================
  const [editableTdClasses, setEditableTdClasses] = useState(tdClasses);  // Array, 리렌더링할 tdClasses array[tdClass, tdClass], tdClass = {Map}
  const [draggableStatus, setDraggbleStatus] = useState(false);
  
  
  
  

// ===========================================================================================================
// ================== function =====================================================================================
// ============================================================================================================
// td 추가
// args = undefined
  const onClickAddTdButton = () => {
    const newTdClasses = [].concat(editableTdClasses);
    // 새로 추가할 td
    const newTdClass = {
      align: "center",
      width: "30",
      height: `100`,
      content: `<b></b>`,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 0,
    };

    newTdClasses.push(newTdClass);
    // 추가한 td를 포함하여 리렌더링
    setEditableTdClasses(newTdClasses);
    const newContents = { ...mailState.contents };
    newContents.body.contentRowTables[rowTableIndex].tdClasses = newTdClasses;
    // context에 dispatch
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents },
    });
  };

  //tr에서 해당 index의 td 제거
  const onClickDeleteTdButton = (index) => {
    // if (index === 0) return;
    const tempTdClasses = [].concat(editableTdClasses);

    const newContents = { ...mailState.contents };
    if (index === editableTdClasses.length - 1) { 
      tempTdClasses.pop();
      setEditableTdClasses(tempTdClasses);
      newContents.body.contentRowTables[
        rowTableIndex
      ].tdClasses = tempTdClasses; 
     } else {
      const newTdClasses = tempTdClasses
        .slice(0, index)
        .concat(tempTdClasses.slice(index + 1, tempTdClasses.length));
      setEditableTdClasses(newTdClasses);
      newContents.body.contentRowTables[rowTableIndex].tdClasses = newTdClasses;
    }
    // tr에서 td제거 후, 가지고 있는 td가 0개라면 해당 tr을 제거
    if(tempTdClasses.length === 0) {
      const tempRowTable = newContents.body.contentRowTables;
      const rowTableLength = tempRowTable.length;
      
      if(rowTableIndex === rowTableLength-1) {
          tempRowTable.pop();
          newContents.body.contentRowTables = tempRowTable;
      } else {
        const newRowTables = tempRowTable.slice(0, rowTableIndex)
          .concat(tempRowTable.slice(rowTableIndex+1, rowTableLength));
          newContents.body.contentRowTables = newRowTables;
      } 
    }
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents, version: mailState.version + 1 },
    });
  };




// ===========================================================================================================
// ================== Hanlder =====================================================================================
// ============================================================================================================

// 테이블 dragStart(dragged가 target)
const tableOnDragStartHandler = (event) => {
  // event.currentTarget.style.position = "absolute";
  // event.currentTarget.style.zIndex="10000";
  event.currentTarget.style.opacity ="0.5";
  // event.currentTarget.style.transform ="translateX(-9999px)";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("movingRowIndex", rowTableIndex);
}

// 테이블 dragEnd(dragged가 target)
const tableOnDragEndHandler = (event) => {
  event.currentTarget.style.position = "static";
  event.currentTarget.style.zIndex="";
  event.currentTarget.style.transition ="";
  event.currentTarget.style.transform ="";
  setDraggbleStatus(false);
}

// 테이블 dragOver(hovered가 target)
const tableOnDragOverEndHandler = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.style.border="3px dashed #20c997";
}

// 테이블 dragEnter
const tableOnDragEnterEndHandler = (event) => {
  const movingRowIndex = event.dataTransfer.getData("movingRowIndex");
  if(movingRowIndex) {
    event.currentTarget.style.border="3px dashed #20c997";
    setTimeout(()=>{
      event.currentTarget.style.border="none";
    }, 1000);
  }
}

// 테이블 dragLeave
const tableOnDragLeaveHandler = (event) => {
  event.preventDefault();
  event.currentTarget.style.border="none";
}

// Drop시 swap
const tableOnDropHandler = (event) => {
  const newContents = {...mailState.contents};
  const movingRowIndex = `${event.dataTransfer.getData("movingRowIndex")}`;
  const tempRowTable = newContents.body.contentRowTables[movingRowIndex];
  newContents.body.contentRowTables[movingRowIndex] = newContents.body.contentRowTables[rowTableIndex];
  newContents.body.contentRowTables[rowTableIndex] = tempRowTable;
  mailDispatch({type:"UPDATE_CONTENTS", value:{contents:newContents, version: mailState.version +1}});
}





// ============================================================================================================
// ============================ HTML ====================================================================================
// ============================================================================================================
  return (
    <Fragment>
      {state.boxShadow === true ? (
              <MenusWrapper>
                <Menus rowTableIndex={rowTableIndex}>
                  <EditButton
                    className="btn btn-primary"
                    onClick={onClickAddTdButton}
                  >
                    <span role="img" aria-label="img">
                      ➕
                    </span>
                  </EditButton>
                  <EditButton
                    className="btn btn-primary"
                    onClick={()=>{setDraggbleStatus(!draggableStatus)}}
                  >
                    <ScrollImage style={{background:draggableStatus?"#20c997":"white"}}/>
                  </EditButton>
                </Menus>
              </MenusWrapper>
            ) : null}
      <table
        role="presentation" 
        style={{width:"100%", maxWidth:"600px", border:"none", borderSpacing:0, fontFamily:"Arial, sans-serif"}}
        draggable={draggableStatus}
          onDragStart={tableOnDragStartHandler}
          onDragEnd={tableOnDragEndHandler}
          onDragOver ={tableOnDragOverEndHandler}
          onDragEnter = {tableOnDragEnterEndHandler}
          onDragLeave = {tableOnDragLeaveHandler}
          // swap
          onDrop = {tableOnDropHandler}
      >
        {/* tdClass가 분할시 */}
          <tr> 
            {editableTdClasses.map((tdClass, i) => {
              if (Array.isArray(tdClass) === true) {
                return (
                  <td style={{width:`${tdClass[0].width}%`,padding:"0px"}}>
                    <table border={0} cellPadding={0} cellSpacing={0} style={{width:"100%"}} >
                      <tbody>
                        {tdClass.map((td, j) => (
                          <tr>
                            <TdClass
                              rowTableIndex={rowTableIndex}
                              colIndex={i}
                              rowIndex={j}
                              tdClass={td}
                              deleteTd={onClickDeleteTdButton}
                            />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                );
              } else
                return (
                  <Fragment>
                    <TdClass
                      rowTableIndex={rowTableIndex}
                      index={i}
                      tdClass={tdClass}
                      deleteTd={onClickDeleteTdButton}
                    />
                  </Fragment>
                );
            })}
          </tr>
          </table>
    </Fragment>
  );
};





// ============================================================================================================
// ============================ CSS ====================================================================================
// ============================================================================================================
const MenusWrapper = styled.div`
  position: relative;
  /* top: 0px; */
  left: -80px;
`;
const Menus = styled.div`
  position: absolute;
  background: none;
  display: flex;
  z-index: 500px;
  ${(props) => {
    if (props.rowTableIndex % 2 === 0)
      return css`
        top: -10px;
        right: -200px;
      `;
    else
      return css`
        right: -200px;
      `;
  }}
`;

const ScrollImage = styled(scrollImageSVG)`
  background-color: white;
`;
const EditButton = styled.button`
  position: relative;
  width: 20px;
  height: 20px;
  padding: 0px;
  margin: 3px;
  font-size: 10px;
`;
export default RowTable;
