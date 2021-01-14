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
      <figure className="figure">
        <div className="d-flex justify-content-center align-items-center">
          <img
            id="image place" //ref
            className="figure-img img-fluid rounded"
            src={imageSrc}
            alt="#"
            style={{ width: 300, height: 300 }}
          />
        </div>

        <figcaption class="figure-caption">
          이미지를 끌어오거나 붙여넣기 하세요
        </figcaption>
        {onlySrc === true ? (
          <p>
            <label for="link">이미지 링크</label>
            <input
              type="text"
              className="form-control"
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
      </figure>
      <p></p>
    </div>
  );
}
