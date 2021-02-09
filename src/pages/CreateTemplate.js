import React, { useEffect, useContext, useCallback, useState } from "react";
import styled from "styled-components";
import DomToImage from "dom-to-image-more";
import axios from "axios";
import TemplateBackground from "../pageComponents/CreateTemplate/TemplateBackground";
import TemplateMailContents from "../pageComponents/CreateTemplate/TemplateMailContents";
import { globalStateStore } from "../stores/globalStateStore";
import { mailTemplateStore} from "../stores/mailTemplateStore";
import {storageRef} from "../components/Firebase";

const TemplateActionsContext = React.createContext({id:"good"});
function CreateTemplate({history, match}) {
   // ============================================================================================================
  // ===================== context ===================================================================================
  // ============================================================================================================
  const globalState = useContext(globalStateStore);         // globaState
  const mailStateStore = useContext(mailTemplateStore);     // mailTemplateState
  const mailState = mailStateStore.state;                   // 메일 템플릿을 불러오기 위한 state
  const mailDispatch = mailStateStore.dispatch;             // 메일 템플릿을 불러오기 위한 dispatch

  const { state, dispatch } = globalState;                  // backState(배경화면 설정을 위한 state, dispatch)





  // ============================================================================================================
  // ==================  states =====================================================================================
  // ============================================================================================================
  const [tplNo, setTplNo] = useState(match.params.number === ":0" ? null : match.params.number.slice(1, match.params.number.length));   // string, 템플릿 no
  const [title, setTitle] = useState("title");    // string, 템플릿 title
  const [desc, setDesc] = useState("desc");       // string, 템플릿 설명
  const [tplImagesDir, setTplImagesDir] = useState("images"); // string, 템플릿 이미지 주소 
 




   // ============================================================================================================
  // ===================== useEffect ===================================================================================
  // ============================================================================================================
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

    if(tplNo !== null && state.templateBackground === "backImage") {
      mailTemplateSelectOne();
    }
  }, [tplNo, state.templateBackground]);







  // ============================================================================================================
  // ===================== funtions ===================================================================================
  // ============================================================================================================
  // convert 버튼(배경) 핸들러
  const onClickConvertToBackButton = (e) => {
    convertToBackUseCallback();
  };

  // convert 버튼(본템플릿) 핸들러
  const onClickConvertToMailTemplateButton = (e) => {
    convertToMailCallback();
  };

  // dataURLtoFile
  // args = dataurl(Blob:image), fileName(string)
  // return = new File
  const dataURLtoFile = (dataurl, fileName) => {
    let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), 
    n = bstr.length, 
    u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, {type:mime});
  }

  // 배경화면 firebase에 저장
  const saveBackgroundImageToFirebase = async () => {
    dispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: true } });
    if(!tplNo) {
      await saveTemplateInsert();
    }
    await (() => {
      const templateId = mailState.number;
      let templateImageName = "background.png";
      const resultDoc = document.getElementById("templateFomrTable");
      DomToImage.toPng(resultDoc)
        .then(function (dataUrl) {
          const imageFile = dataURLtoFile(`${dataUrl}`, templateImageName);
          storageRef.child(`images/${templateId}/${templateImageName}`).put(imageFile)
          .then(()=>{setTimeout(()=>{
              saveTemplateInsert();
          }, 1000)})
          .catch(err=>{
            console.log(err);
          })
        })
        .catch(function (err) {
          alert("oops ", err);
        });
    })();
    
    }



  // ============================================================================================================
  // ================== callback =====================================================================================
  // ============================================================================================================
  // 배경화면을 불러오기 위한 callback
  // args = undefined
  // return = undefined
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

  

  // Background Image 수정 화면과 Mail From 화면 전환 callBack
  // args = undefined
  // return = undefined
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

  


  // ============================================================================================================
  // ===================== axios apis ===================================================================================
  // ============================================================================================================
  // select , 메일 템플릿 조회
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
          localStorage.removeItem('jwtToken');
          history.push("/login");
        }
      } catch(err) {
          alert("서버와의 접근이 불안정합니다.")
      } 
  }



  // insert,update tplNo=="0"일때, 템플릿 저장(insert), tplNo!="0"일때, 템플릿 수정(update) api
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
        }}).catch(function(error) {
        
          if(error.response.status===403) {
            localStorage.removeItem("jwtToken");
            history.push("/login");
          }
        });
          if(response.data.status === "OK") {
            alert(response.data.message);
            if(response.data.data !== "update") {
              history.push(`/createtemplate:${response.data.data}`);
              setTplNo(response.data.data);
            }
          } else if(response.data.status === "NOT_FOUND"){
            alert("인증되지 않은 접근입니다.");
            localStorage.removeItem('jwtToken');
            history.push('/login');
          }else {
            alert(response.message);
          }
        } catch(err) {
          alert("서버와의 연결이 불안정합니다.");
        }
  }

 

  

  // ============================================================================================================
  // ============================ HTML ====================================================================================
  // ============================================================================================================
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
         <button className="btn btn-primary" onClick={()=>{
              if(window.confirm("배경화면을 저장하시겠습니까?") === true) {
                saveBackgroundImageToFirebase();
                onClickConvertToMailTemplateButton();
              }  else {
                onClickConvertToMailTemplateButton();
              }
            }
         }>메일템플릿</button>}
        <button className="btn btn-primary mr-3" onClick={(e)=>{
          saveTemplateInsert();
          // mailTemplateSelectOne();
        }}>저장</button>
      </div>
      <hr/>
      <TemplateActionsContext.Provider value={{saveTemplateInsert, history}}>
          <TemplateBackground />
          <TemplateMailContents tplNo={tplNo}/>
      </TemplateActionsContext.Provider>
      <EmptyDiv><hr/></EmptyDiv>
    </CreateTemplateDiv>
  );
}




// ============================================================================================================
// ============================ CSS ====================================================================================
// ============================================================================================================
const CreateTemplateDiv = styled.div``;
const EmptyDiv = styled.div`
  width: 100%;
  height: 100px;
`;

CreateTemplate.TemplateActionsContext = TemplateActionsContext;
export default CreateTemplate;