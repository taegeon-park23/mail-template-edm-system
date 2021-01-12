import React, { useState, useContext } from "react";

export default function ({ tdClass, tdHeight, tdClassLength }) {
  const maxTdHeight = Math.floor(tdHeight / tdClassLength);
  return (
    <tr>
      <td></td>
    </tr>
  );
}
