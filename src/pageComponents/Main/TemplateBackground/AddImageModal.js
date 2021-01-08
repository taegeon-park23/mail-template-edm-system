import React, { useEffect, useState } from "react";

export default function AddImageModal({ synkEditorToResult }) {
  const [imageSrc, setImageSrc] = useState("#");
  useEffect(() => {
    synkEditorToResult(`<p></p><img src='${imageSrc}'/><p></p>`);
  }, [imageSrc]);

  const onPasteOnCard = (e) => {
    // debugger;
    const items = e.clipboardData.items;
    let length = e.clipboardData.items.length;

    if (items[length - 1]["type"].indexOf("image") === 0) {
      const blob = items[length - 1].getAsFile();
      // console.log("image on");
      const reader = new FileReader();
      reader.onload = function (readEvent) {
        setImageSrc(readEvent.target.result);
      };
      reader.readAsDataURL(blob);
    }
  };
  const onDragOverOnCard = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onDropOnCard = (e) => {
    // debugger;
    e.stopPropagation();
    e.preventDefault();
    const items = e.dataTransfer.items;
    let length = e.dataTransfer.items.length;

    // console.log(items);
    // e.preventDefault();
    // debugger;
    if (items[length - 1]["type"].indexOf("image") === 0) {
      const blob = items[length - 1].getAsFile();
      // console.log("image on");
      const reader = new FileReader();
      reader.onload = function (readEvent) {
        setImageSrc(readEvent.target.result);
      };
      // console.log(blob);
      reader.readAsDataURL(blob);
    }
  };

  return (
    <div
      className="card bg-dark text-white"
      onPaste={onPasteOnCard}
      onDragOver={onDragOverOnCard}
      onDrop={onDropOnCard}
    >
      <p></p>
      <img
        id="image place" //ref
        className="card-img mx-auto"
        src={imageSrc}
        alt="#"
        style={{ width: 300, height: 300 }}
      />
      <p></p>
      <div className="card-img-overlay">
        <h5 className="card-title">Image drop down</h5>
        <p className="card-text">Drop down or paste image in this area.</p>
        <p className="card-text"></p>
      </div>
    </div>
  );
}
