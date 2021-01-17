import React, { useEffect, useState } from "react";

export default function AddImageModal({ synkEditorToResult, onlySrc, image }) {
  
  const [link, setLink] = useState(image ? image.link : "#");
  const [imageSrc, setImageSrc] = useState(image ? image.src : "#");

  const setImage = (imageSrc) => {
    if (onlySrc === true) {
      synkEditorToResult({ src: `${imageSrc}`, link: link });
    } else {
      synkEditorToResult(
        `<p style="margin:0"></p><img src='${imageSrc}'/><p style="margin:0"></p>`
      );
    }
  }

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
        setImage(readEvent.target.result);
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
        setImage(readEvent.target.result);
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
          {imageSrc !== "#"?
          <img
            id="image place" //ref
            className="border rounded figure-img img-fluid rounded"
            src={imageSrc}
            alt="#"
            style={{ border:"dashed", width: 200, height: 200 }}
          />: <div className="border rounded" style={{width:200, height: 200}}>

            </div>}
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
                if(onlySrc && imageSrc!=="#") {
                  synkEditorToResult({ src: `${imageSrc}`, link: e.target.value });
                }
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
