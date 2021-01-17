import React, { useState } from "react";
export default function CreateBoxModal({
  maxWidth,
  maxHeight,
  createBox,
  onClose
}) {
  const initialBoxSize = { width: 100, height: 100 };
  const [boxSize, setBoxSize] = useState(initialBoxSize);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">박스 생성</h5>
        <h6 className="card-subtitle mb-2 text-muted">이메일 폼 박스</h6>
        <p className="card-text">생성할 박스의 크기를 지정하세요</p>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              Width
            </span>
          </div>
          <input
            type="number"
            className="form-control"
            placeholder="100"
            aria-label="width"
            aria-describedby="basic-addon1"
            value={boxSize.width}
            onChange={(e) => {
              let width = parseInt(e.target.value);
              if (width < maxWidth && width > 0)
                setBoxSize({ ...boxSize, width: e.target.value });
            }}
          />
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              Height
            </span>
          </div>
          <input
            type="number"
            className="form-control"
            placeholder="100"
            aria-label="height"
            aria-describedby="basic-addon2"
            value={boxSize.height}
            onChange={(e) => {
              let height = parseInt(e.target.value);
              if (height < maxHeight && height > 0)
                setBoxSize({ ...boxSize, height: e.target.value });
            }}
          />
        </div>
        <button
          className="btn btn-secondary btn-lg btn-block"
          onClick={() => {
            createBox(boxSize.width, boxSize.height);
            // onClose();
          }}
        >
          Create Box
        </button>
      </div>
    </div>
  );
}
