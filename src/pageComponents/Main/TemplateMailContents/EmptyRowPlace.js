import React from "react";
const EmptyRowPlace = ({ height }) => {
  const emptyStyle = {
    fontSize: 0,
    lineHeight: 0
  };
  return (
    <tr>
      <td style={emptyStyle} height={height}>
        &nbsp;
      </td>
    </tr>
  );
};

export default EmptyRowPlace;
