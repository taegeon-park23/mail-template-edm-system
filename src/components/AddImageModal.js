import React, { useState } from "react";

export default function AddImageModal({ synkEditorToResult, onlySrc, image }) {
  
  // ============================================================================================================
  // ==================  states =====================================================================================
  // ============================================================================================================
  const [link, setLink] = useState(image ? image.link : "#");         // string, 앵커 태그 href 속성을 위한 state
  const [imageSrc, setImageSrc] = useState(image ? image.src : "#");  // string, 이미지 태그 src 속성을 위한 state




  // ============================================================================================================
  // ===================== funtions ===================================================================================
  // ============================================================================================================
  // 이미지 지정 함수
  const setImage = (imageSrc) => {
    if (onlySrc === true) { //onlySrc props가 true라면, (tdClass에서 이미지를 지정한 것임으로) 
      synkEditorToResult({ src: `${imageSrc}`, link: link }); // tdClass에서 사용하는 image 객체를 생성하여 synk
    } else {  // onlySrc props를 지정하지 않았다면, 배경화면에서 지정한 것임으로, 이미지를 가지는 html 태그 문자열을 작성하여 리턴
      synkEditorToResult(
        `<p style="margin:0"></p><img src='${imageSrc}'/><p style="margin:0"></p>`
      );
    }
  }


  // 붙여넣기 이벤트 핸들러
  // args = e(PasteEvent)
  // return = undefined
  const onPasteOnCard = (e) => {
    const items = e.clipboardData.items;
    let length = e.clipboardData.items.length;

    if (items[length - 1]["type"].indexOf("image") === 0) {
      const blob = items[length - 1].getAsFile();
      const reader = new FileReader();
      reader.onload = function (readEvent) {
        setImageSrc(readEvent.target.result);
        setImage(readEvent.target.result);
      };
      reader.readAsDataURL(blob);
    }
  };

  // dragOver 이벤트 핸들러
  // args = e(DragOverEvent)
  // return = undefined
  const onDragOverOnCard = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // drop 이벤트 핸들러
  // args = e(DropEvent)
  // return = undefined
  const onDropOnCard = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const items = e.dataTransfer.items;
    let length = e.dataTransfer.items.length;

    if (items[length - 1]["type"].indexOf("image") === 0) {
      const blob = items[length - 1].getAsFile();
      const reader = new FileReader();
      reader.onload = function (readEvent) {
        setImageSrc(readEvent.target.result);
        setImage(readEvent.target.result);
      };
      reader.readAsDataURL(blob);
    }
  };






  // ============================================================================================================
  // ============================ HTML ====================================================================================
  // ============================================================================================================
  return (
    <div
      className="container-fluid card bg-white px-2 py-2 rounded"
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

        <figcaption className="figure-caption">
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
