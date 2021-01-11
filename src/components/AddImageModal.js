import React, { useEffect, useState } from "react";

export default function AddImageModal({ synkEditorToResult, onlySrc }) {
  const [imageSrc, setImageSrc] = useState("#");
  const [link, setLink] = useState("#");
  useEffect(() => {
    if (onlySrc === true) {
      synkEditorToResult({ src: `${imageSrc}`, link: link });
    } else {
      synkEditorToResult(
        `<p style="margin:0"></p><img src='${imageSrc}'/><p style="margin:0"></p>`
      );
    }
  }, [imageSrc, link]);

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

        {onlySrc === true ? (
          <p>
            <label for="link">link</label>
            <input
              type="text"
              class="form-control"
              id="link"
              aria-describedby="iink"
              placeholder="link"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </p>
        ) : null}
      </div>
    </div>
  );
}
