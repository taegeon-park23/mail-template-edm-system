import React, { useState } from "react";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";

export default function AddButtonModal({setButton, setContent,button, tdWidth, tdHeight}) {
    const IntitialButtonConfig = {
        borderRadius: "10",
        width: 100,
        height: 50,
        bgcolor: "#007bff",
        color: "white",
        link: "#",
        content: "button",
        result: "",
    };
    const [buttonConfig, setButtonConfig] = useState(button?button:IntitialButtonConfig);
    return(
    <AddButtonMoal className="bg-white px-2 py-2 rounded" style={{width: "100%"}}>
        <div className="d-flex justify-content-center align-items-center overflow-hidden">
          <div className="d-flex justify-content-center align-items-center border rounded" style={{border: "dashed", width:200, height: 200, fontWeight: 700}}>
           {ReactHtmlParser(`<p style="width: ${buttonConfig.width}px; line-height: ${buttonConfig.height}px; background-color: ${buttonConfig.bgcolor}; border-radius: ${buttonConfig.borderRadius}px; text-align:center; margin:0px; padding: 0px;">
            <font color="${buttonConfig.color}">${buttonConfig.content}</font>
            </p>`)}
        </div>
        </div>
            <button className="btn btn-primary" onClick={
                ()=>{
                    const newButtonConfig = {
                        ...buttonConfig,
                        result : `<table background="none" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center" style="width: ${tdWidth}px; height:${tdHeight}px; ">
                        <a class="forsignup" style="text-decoration:none" href="${buttonConfig.link}"><p style="width: ${buttonConfig.width}px; line-height: ${buttonConfig.height}px; background-color: ${buttonConfig.bgcolor}; border-radius: ${buttonConfig.borderRadius}px; text-align:center; font-weight:700; margin:0px; padding: 0px;">
                        <font color="${buttonConfig.color}">${buttonConfig.content}</font>
                        </p></a></td></tr></tbody></table>`
                    };
                    setContent(newButtonConfig.result);
                    setButton(newButtonConfig);}
            }>추가</button>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">text</span>
                </div>
                <input
              type="text"
              placeholder="link"
              className="form-control sm"
              value={buttonConfig.link}
              onChange={(e) => {setButtonConfig({...buttonConfig, link:e.target.value})}}
            />
            </div>
            <div className="input-group mb-3">
            <div className="input-group-prepend">
                    <span className="input-group-text">text</span>
                </div>
                <input
              type="text"
              placeholder="text"
              className="form-control sm"
              value={buttonConfig.content}
              onChange={(e) => {setButtonConfig({...buttonConfig, content:e.target.value})}}
            />
            </div>
            <div className="input-group mb-3">
            <div className="input-group-prepend">
                    <span className="input-group-text">배경색</span>
                </div>
              <input
                type="color"
                className="form-control"
                value={buttonConfig.bgcolor}
                onChange={(e) => {setButtonConfig({...buttonConfig, bgcolor:e.target.value})}}
              />
              <div className="input-group-prepend">
                    <span className="input-group-text">글자색</span>
                </div>
            
              <input
                type="color"
                className="form-control"
                value={buttonConfig.color}
                onChange={(e) => {setButtonConfig({...buttonConfig, color:e.target.value})}}
              />
            </div>
            <div className="input-group mb-3">
            <div className="input-group-prepend">
                    <span className="input-group-text">br</span>
                </div>
                <input
              type="number"
              className="form-control"
              value={buttonConfig.borderRadius}
              onChange={(e) => {setButtonConfig({...buttonConfig, borderRadius:e.target.value})}}
            />
            <div className="input-group-prepend">
                    <span className="input-group-text">W</span>
                </div>
                <input
              type="number"
              className="form-control"
              value={buttonConfig.width}
              onChange={(e) => {setButtonConfig({...buttonConfig, width:e.target.value})}}
            />
            <div className="input-group-prepend">
                    <span className="input-group-text">H</span>
                </div>
                <input
              type="text"
              className="form-control"
              value={buttonConfig.height}
              onChange={(e) => {setButtonConfig({...buttonConfig, height:e.target.value})}}
            />
            </div>
    </AddButtonMoal>
  );
}

const AddButtonMoal = styled.div`
    input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;