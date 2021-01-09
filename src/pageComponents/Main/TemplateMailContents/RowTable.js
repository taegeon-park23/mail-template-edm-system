import React, { Fragment, useContext, useEffect, useState } from "react";
import styled from "styled-components";
//components
import TdPaddingSpace from "./RowTable/TdPaddingSpace";
import TdClass from "./RowTable/TdClass";
import { globalStateStore } from "../../../stores/globalStateStore";
import { mailTemplateStore } from "../../../stores/mailTemplateStore";
const RowTable = ({
  header,
  footer,
  tdClasses,
  rowTableIndex,
  deleteRowTable
}) => {
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
      width: "30",
      height: "200",
      content: `<b>td</b>`
    };
    newTdClasses.push(newTdClass);
    setEditableTdClasses(newTdClasses);
    const newContents = { ...mailState.contents };
    if (header === true) {
      newContents.header.tdClasses = newTdClasses;
    } else if (footer === true) {
      newContents.footer.tdClasses = newTdClasses;
    } else {
      newContents.body.contentRowTables[rowTableIndex].tdClasses = newTdClasses;
      mailDispatch({
        type: "UPDATE_CONTENTS",
        value: { contents: newContents }
      });
    }
  };

  const onClickDeleteTdButton = (index) => {
    // if (index === 0) return;
    const tempTdClasses = [].concat(editableTdClasses);
    if (index === editableTdClasses.length - 1) {
      tempTdClasses.pop();
      setEditableTdClasses(tempTdClasses);
      return;
    }
    const newTdClasses = tempTdClasses
      .slice(0, index)
      .concat(tempTdClasses.slice(index + 1, tempTdClasses.length));
    setEditableTdClasses(newTdClasses);
    const newContents = { ...mailState.contents };
    if (header === true) {
      newContents.header.tdClasses = newTdClasses;
    } else if (footer === true) {
      newContents.footer.tdClasses = newTdClasses;
    } else {
      newContents.body.contentRowTables[rowTableIndex].tdClasses = newTdClasses;
      mailDispatch({
        type: "UPDATE_CONTENTS",
        value: { contents: newContents }
      });
    }
  };

  return (
    <tr>
      <td align="center" style={tdStyle}>
        {state.boxShadow === true ? (
          <Menus>
            <EditButton className="btn btn-dark" onClick={onClickAddTdButton}>
              <span role="img" aria-label="img">
                ➕
              </span>
            </EditButton>
            {typeof rowTableIndex === "number" && rowTableIndex !== 0 ? (
              <EditButton
                className="btn btn-dark"
                onClick={() => {
                  deleteRowTable(rowTableIndex);
                }}
              >
                <span role="img" aria-label="img">
                  ➖
                </span>
              </EditButton>
            ) : null}
          </Menus>
        ) : null}
        <table width={"100%"} border={0} cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              {editableTdClasses.length !== 1 ? (
                editableTdClasses.map((tdClass, i) => {
                  if (i === editableTdClasses.length - 1)
                    return (
                      <Fragment>
                        <TdPaddingSpace width={"5%"} />
                        <TdClass
                          header={header}
                          footer={footer}
                          rowTableIndex={rowTableIndex}
                          index={i}
                          tdClass={tdClass}
                          deleteTd={onClickDeleteTdButton}
                        />
                      </Fragment>
                    );
                  else if (i === editableTdClasses.length - 2)
                    return (
                      <TdClass
                        header={header}
                        footer={footer}
                        rowTableIndex={rowTableIndex}
                        index={i}
                        tdClass={tdClass}
                        deleteTd={onClickDeleteTdButton}
                      />
                    );
                  else
                    return (
                      <Fragment>
                        <TdClass
                          header={header}
                          footer={footer}
                          rowTableIndex={rowTableIndex}
                          index={i}
                          tdClass={tdClass}
                          deleteTd={onClickDeleteTdButton}
                        />
                        <TdPaddingSpace width={"5%"} />
                      </Fragment>
                    );
                })
              ) : editableTdClasses.length === 0 ? null : (
                <TdClass
                  header={header}
                  footer={footer}
                  index={0}
                  rowTableIndex={rowTableIndex}
                  tdClass={tdClasses[0]}
                />
              )}
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
};
const Menus = styled.div`
  position: absolute;
  background: none;
  display: flex;
  flex-direction: column;
  top: 0px;
  left: -40px;
`;
const EditButton = styled.button`
  position: relative;
  width: 30px;
  height: 30px;
  padding: 0px;
  font-weight: 800;
  margin: 5px;
`;
export default RowTable;
