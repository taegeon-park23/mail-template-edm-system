import React, { useContext } from "react";
import { backImageTemplateStore } from "../../../../stores/backImageTemplateStore";

export default function TdPaddingSpace({ width }) {
  const globalState = useContext(backImageTemplateStore);
  const { state } = globalState;
  const tempTdStyle = {
    fontSize: 0,
    lineHeight: 0
  };
  const tdStyle =
    state.boxShadow === true
      ? { fontSize: 0.1, position: "relative" }
      : { ...tempTdStyle };
  return (
    <td style={tdStyle} width={width}>
      <p style={{ position: "absolute" }}>{`←${width}→`}</p>
    </td>
  );
}
