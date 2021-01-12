import React, { Fragment, useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
//components
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

  const tempTdStyle = {
    position: "relative"
  };
  const tdStyle = state.boxShadow === true ? { ...tempTdStyle } : {};

  const onClickAddTdButton = () => {
    const newTdClasses = [].concat(editableTdClasses);
    const newTdClass = {
      align: "center",
      width: "200",
      height: `${tdClasses[0].height}`,
      content: `<b>td</b>`
    };
    newTdClasses.push(newTdClass);
    setEditableTdClasses(newTdClasses);
    const newContents = { ...mailState.contents };
    newContents.body.contentRowTables[rowTableIndex].tdClasses = newTdClasses;
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents }
    });
  };

  const onClickDeleteTdButton = (index) => {
    // if (index === 0) return;
    const tempTdClasses = [].concat(editableTdClasses);

    const newContents = { ...mailState.contents };
    if (index === editableTdClasses.length - 1) {
      tempTdClasses.pop();
      setEditableTdClasses(tempTdClasses);
      newContents.body.contentRowTables[rowTableIndex].tdClasses = tempTdClasses;
    
    } else {
      const newTdClasses = tempTdClasses
      .slice(0, index)
      .concat(tempTdClasses.slice(index + 1, tempTdClasses.length));
    setEditableTdClasses(newTdClasses);
    newContents.body.contentRowTables[rowTableIndex].tdClasses = newTdClasses;
    
    }
    mailDispatch({
      type: "UPDATE_CONTENTS",
      value: { contents: newContents, version: mailState.version + 1 }
    });
  };

  return (
    <Fragment>
      {state.boxShadow === true ? (
        <MenusWrapper>
          <Menus rowTableIndex={rowTableIndex}>
            <EditButton className="btn btn-dark" onClick={onClickAddTdButton}>
              <span role="img" aria-label="img">
                ➕
              </span>
            </EditButton>
          </Menus>
        </MenusWrapper>
      ) : null}
      <table width={"100%"} border={0} cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
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
                              deleteTd={j === 0 ? onClickDeleteTdButton : null}
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
  /* left: -40px; */
`;
const Menus = styled.div`
  position: absolute;
  background: none;
  display: flex;
  z-index: 500px;
  ${props=>{
    if(props.rowTableIndex%2==0) return css`top: -10px; right: -30px`;
    else return css`right: -30px`}
  }
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
