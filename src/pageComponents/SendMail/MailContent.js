import React,{useEffect, useRef} from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import ReactHtmlParser from "react-html-parser";

export default function MailContent({width, height, content}) {
    const articleRef = useRef(null);
    const textEditorSyncToTdContentFunc = () => {
        if(articleRef) {
            const articleDom = ReactDOM.findDOMNode(articleRef.current);
            const hugeSpanArr = articleDom.querySelectorAll('span.text-huge');
            const bigSpanArr = articleDom.querySelectorAll('span.text-big');
            const defaultSpanArr = articleDom.querySelectorAll('span.text-default');
            const smallSpanArr = articleDom.querySelectorAll('span.text-small');
            const tinySpanArr = articleDom.querySelectorAll('span.text-tiny');
            const ckContentHrArr = articleDom.querySelectorAll('hr');
            const firgureTableArr =articleDom.querySelectorAll('figure');
            if(hugeSpanArr) {
              hugeSpanArr.forEach(span=>{span.style.fontSize="48px"});
            }
            if(bigSpanArr) {
              bigSpanArr.forEach(span=>{span.style.fontSize="36px"});
            }
            if(defaultSpanArr) {
              defaultSpanArr.forEach(span=>{span.style.fontSize="24px"});
            }
            if(smallSpanArr) {
              smallSpanArr.forEach(span=>{span.style.fontSize="12px"});
            }
            if(tinySpanArr) {
              tinySpanArr.forEach(span=>{span.style.fontSize="6px"});
            }
            if(ckContentHrArr) {
                ckContentHrArr.forEach(hr=>{
                    hr.style.margin = "0px";
                    hr.style.borderColor = "#dedede";
                    hr.style.borderWidth = "4px";
                });
            }
            if(firgureTableArr) {
                firgureTableArr.forEach(figure=>{
                  figure.style.margin="0px";
                    const tableArr = figure.querySelectorAll("table");
                tableArr.forEach((table)=>{
                    table.style.borderCollapse = "collapse";
                    table.style.borderSpacing = "0px";
                    table.style.width = "100%";
                    table.style.height = "100%";
                    table.style.boder = "1px double #b3b3b3";
                });
                    const trArr = figure.querySelectorAll('tr'); 
                    trArr.forEach((tr)=>{
                        const tdArr = tr.querySelectorAll('td');
                        tdArr.forEach((td)=>{
                            td.style.minWidth = "2em";
                            td.style.padding = ".4em";
                            td.style.border = "1px solid #bfbfbf";
                        })
                    })  
                });
              }
        }
      } 
    useEffect(()=>{
        textEditorSyncToTdContentFunc();
    })

    return(
        <Article ref={articleRef}>
        {ReactHtmlParser(content)}
        </Article>
    )
}

const Article = styled.article `
    p {margin: 0px; margin-bottom: 0px;}
    ul, ol,li {
   margin: 0px;
   width: 100%;
   height: 100%;
  }
`;