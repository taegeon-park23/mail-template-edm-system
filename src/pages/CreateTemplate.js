import React, { useEffect, useContext, useCallback, useState } from "react";
import styled from "styled-components";
import DomToImage from "dom-to-image";
import axios from "axios";
import TemplateBackground from "../pageComponents/CreateTemplate/TemplateBackground";
import TemplateMailContents from "../pageComponents/CreateTemplate/TemplateMailContents";
import { globalStateStore } from "../stores/globalStateStore";
import { mailTemplateStore} from "../stores/mailTemplateStore";

const TemplateActionsContext = React.createContext({id:"good"});
function CreateTemplate({history, match}) {
  const globalState = useContext(globalStateStore);
  const mailStateStore = useContext(mailTemplateStore);
  const mailState = mailStateStore.state;
  const mailDispatch = mailStateStore.dispatch;

  const { state, dispatch } = globalState;
  const [tplNo, setTplNo] = useState(match.params.number === ":0" ? null : match.params.number.slice(1, match.params.number.length));
  const [title, setTitle] = useState("title");
  const [desc, setDesc] = useState("desc");
  const [tplImagesDir, setTplImagesDir] = useState("images");
 
  useEffect(()=>{
      if(tplNo !== null) {
        mailTemplateSelectOne();
      }
  }, [tplNo])

  // 템플릿 불러오기 API ******************************************************************
  const mailTemplateSelectOne = async () => {
    const url = "/user/selectMailTemplate";
    try {
      const response =
      await axios.post(url, 
          {"tplNo": tplNo}, {headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem('jwtToken')
          }});
        if(response.data.status === "OK") {
            if(response.data.data === null) {
              alert("조회되는 템플릿이 없습니다."); return;
            }
            const tpl = response.data.data;
            setTplNo(tpl.tplNo);
            setTitle(tpl.tplSub);
            setDesc(tpl.tplDesc);
            setTplImagesDir(tpl.tplImagesDir);
            const tmpMailState = {...JSON.parse(tpl.tplContent), number: tpl.tplNo};
            mailDispatch({type:"DOWNLOAD_MAIL_STATE", value:{mailState: tmpMailState}});
        } else if(response.data.status === "NOT_FOUND"){
          alert("인증되지 않은 접근입니다.");
          localStorage.removeItem('jwtToken')
        }
      } catch(err) {
          alert("서버와의 접근이 불안정합니다.")
      } 
  }


  const saveTemplateInsert = async (e) => {
        const url = "/user/save";
        try {
        const response = await axios.post(url,{
          "tplNo": tplNo,
          "tplSub": title,
          "tplDesc": desc,
          "tplContent": JSON.stringify(mailState),
          "tplImagesDir": tplImagesDir ? tplImagesDir : "images",
          "useStatus": 0
        }, {headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem('jwtToken')
        }});
          if(response.data.status === "OK") {
            alert(response.data.message);
            if(response.data.data !== "update") {
              history.push(`/createtemplate:${response.data.data}`);
              setTplNo(response.data.data);
            }
          } else if(response.data.status === "NOT_FOUND"){
            alert("인증되지 않은 접근입니다.");
            localStorage.removeItem('jwtToken');
          }else {
            alert(response.message);
          }
        } catch(err) {
          alert("서버와의 연결이 불안정합니다.");
        }
  }

  const convertToBackUseCallback = useCallback(() => {
    dispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: true } });
    const resultDoc = document.getElementById("TemplateMailContentsTable");
    resultDoc.style.background = "";
    setTimeout(() => {
      DomToImage.toPng(resultDoc)
        .then(function (dataUrl) {
          dispatch({
            type: "CONVERTING_IMAGE",
            value: {
              convertedImage: dataUrl,
              modifiableBoxesState: true,
              templateBackground: "backMail",
              tableHeight: resultDoc.offsetHeight
            }
          });
        })
        .catch(function (err) {
          alert("oops ", err);
        });
    });
  });

  const onClickConvertToBackButton = (e) => {
    convertToBackUseCallback();
  };

  // Background Image 수정 화면과 Mail From 화면 전환 callBack
  const convertToMailCallback = useCallback(() => {
    dispatch({
      type: "ON_OFF_ALL_MODIFIABLE_BOXES_STATE",
      value: { modifiableBoxesState: false },
    });
    const resultDoc = document.getElementById("templateFomrTable");
    resultDoc.style.background = "";
    DomToImage.toPng(resultDoc)
      .then(function (dataUrl) {
        dispatch({
          type: "CONVERTING_IMAGE",
          value: {
            convertedImage: dataUrl,
            modifiableBoxesState: false,
            templateBackground: "backImage",
          },
        });
      })
      .catch(function (err) {
        alert("oops ", err);
      });
  });

  const onClickConvertToMailTemplateButton = (e) => {
    convertToMailCallback();
  };


  useEffect(() => {
    const TemplateBackgroundDom = document.getElementById("TemplateBackground");
    const TemplateMailContentsDom = document.getElementById(
      "TemplateMailContents"
    );
    //[페이지 전환] TemplateBackground, TemplateMailContents page 전환
    if (state.templateBackground === "backMail") {
      TemplateMailContentsDom.style.display = "none";
      TemplateBackgroundDom.style.display = "block";
    } else if (state.templateBackground === "backImage") {
      TemplateBackgroundDom.style.display = "none";
      TemplateMailContentsDom.style.display = "block";
    }
  });

  return (
    <CreateTemplateDiv className="container-fluid ">
      <div className="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p className=" mr-auto">
            <h3>템플릿 생성</h3><sup>{state.templateBackground === "backImage" ?"메일템플릿":"배경화면"}</sup>
          </p>
        </div>
        
        <form method="post" action="upload" enctype="multipart/form-data" id="uploadHtmlFile"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="input-group mb-3">
              <label for="bcc" className="col-2 col-sm-1 col-form-label">
              제목
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="title"
                aria-label="title"
                aria-describedby="basic-addon2"
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
              />
            </div>
            <div className="input-group mb-3">
              <label for="bcc" className="col-2 col-sm-1 col-form-label">
                설명
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="desc"
                aria-label="desc"
                aria-describedby="basic-addon2"
                value={desc}
                onChange={(e)=>{setDesc(e.target.value)}}
              />
            </div>
          </form>
        <div className="w-100 d-flex flex-row-reverse">
        {state.templateBackground ==="backImage" ?
         <button className="btn btn-primary" onClick={onClickConvertToBackButton}>배경화면</button> :
         <button className="btn btn-primary" onClick={onClickConvertToMailTemplateButton}>메일템플릿</button>}
        <button className="btn btn-primary mr-3" onClick={(e)=>{
          saveTemplateInsert();
          // mailTemplateSelectOne();
        }}>저장</button>
      </div>
      <hr/>
      <TemplateBackground />
      <TemplateActionsContext.Provider value={{saveTemplateInsert, history}}>
          <TemplateMailContents />
      </TemplateActionsContext.Provider>
      <EmptyDiv><hr/></EmptyDiv>
    </CreateTemplateDiv>
  );
}

const CreateTemplateDiv = styled.div``;
const EmptyDiv = styled.div`
  width: 100%;
  height: 100px;
`;

CreateTemplate.TemplateActionsContext = TemplateActionsContext;
export default CreateTemplate;