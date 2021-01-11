import React, { useContext, useState } from "react";

const EmptyRowPlace = ({ rowTableIndex, height }) => {
  const emptyStyle = {
    fontSize: 0,
    lineHeight: 0
  };
  return (
    <table>
      <tr>
        <td style={emptyStyle} height={height}>
          &nbsp;
        </td>
      </tr>
    </table>
  );
};

export default EmptyRowPlace;
