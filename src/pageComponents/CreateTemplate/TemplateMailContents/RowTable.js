import React, { Fragment, useContext, useRef, useState } from "react";
import styled, { css } from "styled-components";
import ReactDOM from "react-dom";
//components
import { ReactComponent as scrollImageSVG } from "../../../assets/icons/scroll.svg";
import TdClass from "./RowTable/TdClass";

import { globalStateStore } from "../../../stores/globalStateStore";
import { mailTemplateStore } from "../../../stores/mailTemplateStore";
const RowTable = ({ tdClasses, rowTableIndex, deleteRowTable }) => {
  const globalState = useContext(globalStateStore);
  const { state } = globalState;
  const mailGlobalState = useContext(mailTemplateStore);
  const mailState = mailGlobalState.state;
  const mailDispatch = mailGlobalState.dispatch;
  const [editableTdClasses, setEditableTdClasses] = useState(tdClasses);
  const [draggableStatus, setDraggbleStatus] = useState(false);
  const TableRowRef = useRef(null);

  const tempTdStyle = {
    position: "relative",
  };
  const tdStyle = state.boxShadow === true ? { ...tempTdStyle } : {};

  const onClickAddTdButton = () => {
    const newTdClasses = [].concat(editableTdClasses);
    const newTdClass = {
      align: "center",
      width: "10",
      height: `10`,
      content: `<b></b>`,
    };
    newTdClasses.push(newTdClass);
    setEditableTdClasses(newTdClasses);
    const newContents = { ...mailState.contents };
    newContents.body.contentRowTables[rowTableIndex].tdClasses = newTdClasses;
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents },
    });
  };

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
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents, version: mailState.version + 1 },
    });
  };
  return (
    <Fragment>
      <table width={"100%"} border={0} cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr ref={TableRowRef} 
          draggable={draggableStatus}
          onDragStart={(e) => {
            e.currentTarget.style.position = "absolute";
            e.currentTarget.style.zIndex="10000";
            e.currentTarget.style.transition ="0.01s";
            e.currentTarget.style.transform ="translateX(-9999px)";
            e.currentTarget.style.border="3px dashed #20c997";
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("movingRowIndex", rowTableIndex);
          }}
          onDragEnd={(e)=>{
            e.currentTarget.style.position = "static";
            e.currentTarget.style.zIndex="";
            e.currentTarget.style.transition ="";
            e.currentTarget.style.transform ="";
            e.target.style.border="none";
            setDraggbleStatus(false);
          }}
          onDragOver ={(e)=>{
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragEnter = {
            (e) => {
              e.preventDefault();
              const movingRowIndex = e.dataTransfer.getData("movingRowIndex");
                e.currentTarget.style.border="3px dashed #20c997";
            }
          }
          onDragLeave = {
            (e) => {
              e.preventDefault();
              const movingRowIndex = e.dataTransfer.getData("movingRowIndex");
                e.currentTarget.style.border="none";
            }
          }
          // swap
          onDrop = {(e)=>{
            const newContents = {...mailState.contents};
            const movingRowIndex = `${e.dataTransfer.getData("movingRowIndex")}`;
            const tempRowTable = newContents.body.contentRowTables[movingRowIndex];
            newContents.body.contentRowTables[movingRowIndex] = newContents.body.contentRowTables[rowTableIndex];
            newContents.body.contentRowTables[rowTableIndex] = tempRowTable;
            mailDispatch({type:"UPDATE_CONTENTS", value:{contents:newContents, version: mailState.version +1}});
            
          }}
          >
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
            {editableTdClasses.map((tdClass, i) => {
              if (Array.isArray(tdClass) === true) {
                return (
                  <td>
                    <table cellPadding={0} cellSpacing={0}>
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
        </tbody>
      </table>
    </Fragment>
  );
};
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
    if (props.rowTableIndex % 2 == 0)
      return css`
        top: -10px;
        right: -60px;
      `;
    else
      return css`
        right: -60px;
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
