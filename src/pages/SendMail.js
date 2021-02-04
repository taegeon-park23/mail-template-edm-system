import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

import MailEditor from "../pageComponents/SendMail/MailEditor";
import { globalStateStore } from "../stores/globalStateStore";
import { mailTemplateStore } from "../stores/mailTemplateStore";
import TemplateMailContents from "../pageComponents/CreateTemplate/TemplateMailContents";
import AddressboookList from "../pageComponents/SendMail/AddressbookList";
import ReactDOM from "react-dom";
import GroupAndAddressbookList from "../pageComponents/SendMail/GroupAndAddressbookList";
import Modal from "../components/Modal";
import MailTemplateList from "../pageComponents/SendMail/MailTemplateList";

export default function SendMail({ history, match }) {
  const globalState = useContext(globalStateStore);
  const backState = globalState.state;
  const backDispatch = globalState.dispatch;
  const mailStateSotre = useContext(mailTemplateStore);
  const mailState = mailStateSotre.state;
  const mailDispatch = mailStateSotre.dispatch;
  const [showTemplate, setShowTemplate] = useState(false);

  const { number } = match.params;
  // ref
  const inputReceiverRef = useRef(null);
  const inputRefRef = useRef(null);
  // state
  const [modalStatus, setModalStatus] = useState(false);
  const [refModalStatus, setRefModalStatus] = useState(false);
  const [tplModalStatus, setTplModalStatus] = useState(false);
  const [receiver, setReciver] = useState("");
  const [references, setRefrences] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [receiverList, setReceiverList] = useState([]);
  const [refList, setRefList] = useState([]);
  const [sendRecTplNo, setSendRecTplNo] = useState(0);
  const [tpl, setTpl] = useState(null);

  useEffect(() => {
    if (showTemplate) backDispatch({ type: "CONVERT_BOX_SHADOW", value: { boxShadow: false } });

    if(sendRecTplNo !== 0) {
      mailTemplateSelectOne({tplNo: sendRecTplNo})
    } else if (number !== "0") {
      selectMailDraftByDraftNo({ draftNo: number });
    }

    if (showTemplate === false && number !== "0") {
      setShowTemplate(true);
    }
    
    
  }, [number, showTemplate, sendRecTplNo]);

  // deleteReceiver
  const deleteReciver = (i) => {
    let newReceiverList = [...receiverList];
    if (i === newReceiverList.length - 1) newReceiverList.pop();
    else {
      newReceiverList = newReceiverList
        .slice(0, i)
        .concat(newReceiverList.slice(i + 1, newReceiverList.length));
    }
    setReceiverList(newReceiverList);
  };

  const deleteRef = (i) => {
    let newReceiverList = [...refList];
    if (i === newReceiverList.length - 1) newReceiverList.pop();
    else {
      newReceiverList = newReceiverList
        .slice(0, i)
        .concat(newReceiverList.slice(i + 1, newReceiverList.length));
    }
    setRefList(newReceiverList);
  };

  // 템플릿 불러오기 API ******************************************************************
  const mailTemplateSelectOne = async (tplInfo = {}) => {
    const url = "/user/selectMailTemplate";
    try {
      const response = await axios.post(
        url,
        { ...tplInfo },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      );
      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회되는 템플릿이 없습니다.");
          return;
        }
        const tpl = response.data.data;
        setTpl(tpl);
        const tmpMailState = {
          ...JSON.parse(tpl.tplContent),
          number: tpl.tplNo,
        };
        mailDispatch({
          type: "DOWNLOAD_MAIL_STATE",
          value: { mailState: tmpMailState },
        });
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  // draft 불러오기 API ******************************************************************
  const selectMailDraftByDraftNo = async (draftInfo = {}) => {
    const url = "/user/selectMailDraftByDraftNo";
    try {
      const response = await axios.post(
        url,
        { ...draftInfo },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      );
      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회되는 템플릿이 없습니다.");
          return;
        }
        const draft = response.data.data;
        setTitle(draft.draftTitle);
        setContent(draft.draftDesc);
        setReceiverList(JSON.parse(draft.draftReceiver));
        setRefList(JSON.parse(draft.draftReference));
        setSendRecTplNo(parseInt(draft.draftTplNo));
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  // draft 저장(insert) API ******************************************************************
  const updateMailDraft = async (draftInfo = {}) => {
    const url = "/user/updateMailDraft";
    try {
      const response = await axios.post(
        url,
        { ...draftInfo },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      );
      if (response.data.status === "OK") {
        alert(response.data.message);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  // draft 저장(update) API ******************************************************************
  const insertMailDraft = async (draftInfo = {}) => {
    const url = "/user/insertMailDraft";
    try {
      const response = await axios.post(
        url,
        { ...draftInfo },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      );
      if (response.data.status === "OK") {
        alert(response.data.message);
        const draftNo = response.data.data.draftNo;
        history.push(`/sendmail/${draftNo}`);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  // 미리보기
  const convertToHTML = () => {
    const mailResultDoc = document.getElementById("mailResult");
    const resultDoc = document.getElementById("TemplateMailContentsTable");

    if (resultDoc === undefined) {
      alert("템플릿을 설정해주세요");
      return;
    }

    const downloadHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Email Design</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!--[if (mso 16)]><style type="text/css">a {text-decoration: none;}</style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
      <v:rect xmlns_v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;">
        <v:fill type="tile" src="${backState.convertedImage}" color="#7bceeb" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]--><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG></o:AllowPNG><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    </head><body style="background-repeat:no-repeat"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"><v:fill type="tile" color="#fff1e6"></v:fill></v:background><![endif]-->
    <table border="0" cellspadding="0" cesllspacing="0"><tbody><tr><td style="width: ${
      mailState.tableWidth
    }px">${
      mailResultDoc ? mailResultDoc.innerHTML : ""
    }</td></tr></tobdy></table>
     ${resultDoc ? resultDoc.innerHTML : ""}
    </body></html>`;

    const blob = new Blob([downloadHtml], {
      type: "text/html",
      endings: "native",
    });
    blob.name = "htmlTemplate.html";
    blob.lastModifiedData = new Date();
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("target", "_blank");
    element.click();
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sendMail = async () => {
    const mailResultDoc = document.getElementById("mailResult");
    const resultDoc = document.getElementById("TemplateMailContentsTable");
    let blob = null;

    // 템플릿이 존재할 때, HTML 파일 생성
    if (resultDoc !== null) {
      const downloadHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Email Design</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!--[if (mso 16)]><style type="text/css">a {text-decoration: none;}</style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
      <v:rect xmlns_v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;">
        <v:fill type="tile" src="${backState.convertedImage}" color="#7bceeb" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]--><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG></o:AllowPNG><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    </head><body style="background-repeat:no-repeat"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"><v:fill type="tile" color="#fff1e6"></v:fill></v:background><![endif]-->
    <table border="0" cellspadding="0" cesllspacing="0"><tbody><tr><td id="mailResult" style="width: ${
      mailState.tableWidth
    }px">${
        mailResultDoc ? mailResultDoc.innerHTML : ""
      }</td></tr></tobdy></table>
     ${resultDoc ? resultDoc.innerHTML : ""}
    </body></html>`;
      blob = new Blob([downloadHtml], {
        type: "text/html",
        endings: "native",
      });
      blob.name = "htmlTemplate.html";
      blob.lastModifiedData = new Date();
    } else {
      alert("템플릿을 설정해주세요");
      return;
    }

    // sendMail API *********************************************************************************
    try {
      const instance = axios.create({
        url: "user/mail",
        method: "post",
        baseURL: "",
        headers: { "Content-Type": "application/json" },
        responseType: "json",
        onUploadProgress: (progressEvent) => {},
        onDownloadProgress: (progressEvent) => {},
      });

      const formData = new FormData();
      formData.append("address", JSON.stringify(receiverList));
      formData.append("ccs", JSON.stringify(refList));
      formData.append("title", title);
      formData.append("message", mailResultDoc.innerHTML);
      formData.append("tplNo", sendRecTplNo);
      formData.append("htmlTemplate", blob, "htmlTemplate.html");
      const response = await instance.post("/user/mail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": localStorage.getItem("jwtToken"),
        },
      });

      if (response.data.status === "OK") {
        alert(response.data.message);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  // *********************************************************************************
  // HTML *********************************************************************************
  // *********************************************************************************

  return (
    <SendMailDiv className="container bootdey">
      {modalStatus === true ? (
        <Modal
          visible={modalStatus}
          onClose={() => {
            setModalStatus(false);
          }}
          children={
            <GroupAndAddressbookList
              onClose={() => {
                setModalStatus(false);
              }}
              receiverList={receiverList}
              setReceiverList={setReceiverList}
            />
          }
        />
      ) : null}

      {refModalStatus === true ? (
        <Modal
          visible={refModalStatus}
          onClose={() => {
            setRefModalStatus(false);
          }}
          children={
            <GroupAndAddressbookList
              onClose={() => {
                setRefModalStatus(false);
              }}
              receiverList={refList}
              setReceiverList={setRefList}
            />
          }
        />
      ) : null}

      {tplModalStatus === true ? (
        <Modal
          visible={tplModalStatus}
          onClose={() => {
            setTplModalStatus(false);
          }}
          children={
            <MailTemplateList
              onClose={() => {
                setTplModalStatus(false);
              }}
              setSendRecTplNo={(no) => {
                setSendRecTplNo(no);
                mailTemplateSelectOne({ tplNo: no });
              }}
            />
          }
        />
      ) : null}

      <div class="email-app">
        <main>
          <div class="d-flex justify-content-center align-items-center ml-3 mt-3">
            <p class=" mr-auto">
              <h3>메일 보내기</h3>
            </p>
            <button
              class="btn btn-primary rounded mr-3"
              onClick={() => {
                sendMail();
              }}
            >
              보내기
            </button>
            <button
              class="btn btn-primary rounded mr-3"
              onClick={convertToHTML}
            >
              미리보기
            </button>
            <button
              class="btn btn-primary rounded mr-3"
              onClick={() => {
                if (number === "0") {
                  insertMailDraft({
                    draftTplNo: sendRecTplNo,
                    draftTitle: title,
                    draftDesc: content,
                    draftReceiver: JSON.stringify(receiverList),
                    draftReference: JSON.stringify(refList),
                    draftAttach: "",
                  });
                } else {
                  updateMailDraft({
                    draftNo: number,
                    draftTplNo: sendRecTplNo,
                    draftTitle: title,
                    draftDesc: content,
                    draftReceiver: JSON.stringify(receiverList),
                    draftReference: JSON.stringify(refList),
                    draftAttach: "",
                  });
                }
              }}
            >
              임시저장
            </button>
          </div>
          <p
            class="text-center d-flext justify-content-center rounded-pill"
            style={{ height: "30px" }}
          >
            템플릿을 선택하여 메일을 보내세요
          </p>
          <form
            method="post"
            action="upload"
            enctype="multipart/form-data"
            id="uploadHtmlFile"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="position-static input-group mb-3">
              <label for="bcc" class="col-2 col-sm-1 col-form-label">
                받는 사람
              </label>
              <InputPrependDiv className="input-group-prepend">
                {receiverList.map((receiver, i) => {
                  return (
                    <span
                      className="badge badge-info ml-0 mr-1 my-0 px-1 py-0"
                      style={{ height: "32px", lineHeight: "32px" }}
                    >
                      {receiver.addrNm ? receiver.addrNm : receiver.addrEmail}{" "}
                      <a
                        href=""
                        className="badge badge-light"
                        value={i}
                        onClick={(e) => {
                          e.preventDefault();
                          deleteReciver(i);
                        }}
                      >
                        x
                      </a>
                    </span>
                  );
                })}
              </InputPrependDiv>
              <input
                type="text"
                ref={inputReceiverRef}
                className="form-control"
                placeholder="To"
                aria-label="receiver"
                aria-describedby="basic-addon2"
                value={receiver}
                onChange={(e) => {
                  setReciver(e.target.value);
                }}
              ></input>
              <AddressbookListModal>
                <AddressboookList
                  addrNm={receiver}
                  receiverList={receiverList}
                  setReceiverList={setReceiverList}
                  setReciver={setReciver}
                />
              </AddressbookListModal>
              <InputSideButton
                className="btn btn-primary ml-2"
                onClick={() => {
                  setModalStatus(true);
                }}
              >
                주소록
              </InputSideButton>
            </div>
            {/* <div className="input-group mb-3">
              <label for="bcc" class="col-2 col-sm-1 col-form-label">
                참조
              </label>
              <InputPrependDiv className="input-group-prepend">
                {refList.map((receiver, i) => {
                  return (
                    <span
                      className="badge badge-info ml-0 mr-1 my-0 px-1 py-0"
                      style={{ height: "32px", lineHeight: "32px" }}
                    >
                      {receiver.addrNm ? receiver.addrNm : receiver.addrEmail}{" "}
                      <a
                        className="badge badge-light"
                        value={i}
                        onClick={(e) => {
                          e.preventDefault();
                          deleteRef(i);
                        }}
                      >
                        x
                      </a>
                    </span>
                  );
                })}
              </InputPrependDiv>
              <input
                type="text"
                ref={inputRefRef}
                className="form-control"
                placeholder="Ref"
                aria-label="ref"
                aria-describedby="basic-addon2"
                value={references}
                onChange={(e) => {
                  setRefrences(e.target.value);
                }}
              />
              <AddressbookListModal left={inputRefLeft}>
                <AddressboookList
                  addrNm={references}
                  receiverList={refList}
                  setReceiverList={setRefList}
                  setReciver={setRefrences}
                />
              </AddressbookListModal>
              <InputSideButton
                className="btn btn-primary ml-2"
                onClick={() => {
                  setRefModalStatus(true);
                }}
              >
                주소록
              </InputSideButton>
            </div> */}
            <div className="input-group mb-3">
              <label for="bcc" class="col-2 col-sm-1 col-form-label">
                메일 템플릿
              </label>
              <div className="input-group-prepend"></div>
              <input
                type="text"
                className="form-control"
                placeholder="@"
                aria-label="mailTemplate"
                aria-describedby="basic-addon2"
                value={tpl ? `${tpl.tplNo}:${tpl.tplSub}` : "@"}
                readOnly={true}
              />
              <InputSideButton
                className="btn btn-primary ml-2"
                onClick={() => {
                  setShowTemplate(true);
                  setTplModalStatus(true);
                }}
              >
                템플릿
              </InputSideButton>
            </div>
            <div class="form-row mb-3">
              <label for="bcc" class="col-2 col-sm-1 col-form-label">
                제목
              </label>
              <div class="col-10 col-sm-11">
                <span>
                  <input
                    type="text"
                    class="form-control"
                    id="bcc"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </span>
              </div>
            </div>
            <div class="form-row mb-3">
              <label for="bcc" class="col-2 col-sm-1 col-form-label">
                파일 선택
              </label>
              <div class="col-10 col-sm-11">
                <FileInput type="file" class="form-control" />
              </div>
            </div>
          </form>
          <div class="row">
            <div class="col-sm-11 ml-auto">
              <div class="form-group mt-4" style={{ width: "100%" }}>
                <MailEditor
                  width={mailState.tableWidth}
                  content={content}
                  setContent={setContent}
                />
                <DivideHr />
                {showTemplate ? (
                  <ResultTemplateDiv>
                    <TemplateMailContents result={true} />
                  </ResultTemplateDiv>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SendMailDiv>
  );
}

// *********************************************************************************
// StlyeDiv *********************************************************************************
// *********************************************************************************

const InputPrependDiv = styled.div`
  max-width: 50%;
  height: 38px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 3px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #2f3542;
    border-radius: 3px;
    background-clip: padding-box;
    border: 2px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background-color: grey;
    border-radius: 3px;
    box-shadow: inset 0px 0px 2px white;
  }
`;
const AddressbookListModal = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 10px;
  box-shadow: 1px 1px 2px #858796, -1px -1px 2px #858796;
  z-index: 100;
  left: ${(props) => props.left + 20}px;
`;
const InputSideButton = styled.button`
  height: 38px;
`;

const DivideHr = styled.hr`
  background-color: #d1d3e2;
`;

const ResultTemplateDiv = styled.div`
  border: solid 2px #d1d3e2;
  border-radius: 5px;
  border-top: none;
`;

const FileInput = styled.input`
  border: none;
  button {
    border: none;
  }
`;
const SendMailDiv = styled.div`
  .email-app {
    display: flex;
    flex-direction: row;
    background: #fff;
    border: 1px solid #e1e6ef;
  }

  .email-app nav {
    flex: 0 0 200px;
    padding: 1rem;
    border-right: 1px solid #e1e6ef;
  }

  .email-app nav .btn-block {
    margin-bottom: 15px;
  }

  .email-app nav .nav {
    flex-direction: column;
  }

  .email-app nav .nav .nav-item {
    position: relative;
  }

  .email-app nav .nav .nav-item .nav-link,
  .email-app nav .nav .nav-item .navbar .dropdown-toggle,
  .navbar .email-app nav .nav .nav-item .dropdown-toggle {
    color: #151b1e;
    border-bottom: 1px solid #e1e6ef;
  }

  .email-app nav .nav .nav-item .nav-link i,
  .email-app nav .nav .nav-item .navbar .dropdown-toggle i,
  .navbar .email-app nav .nav .nav-item .dropdown-toggle i {
    width: 20px;
    margin: 0 10px 0 0;
    font-size: 14px;
    text-align: center;
  }

  .email-app nav .nav .nav-item .nav-link .badge,
  .email-app nav .nav .nav-item .navbar .dropdown-toggle .badge,
  .navbar .email-app nav .nav .nav-item .dropdown-toggle .badge {
    float: right;
    margin-top: 4px;
    margin-left: 10px;
  }

  .email-app main {
    min-width: 0;
    flex: 1;
    padding: 1rem;
  }

  .email-app .inbox .toolbar {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e1e6ef;
  }

  .email-app .inbox .messages {
    padding: 0;
    list-style: none;
  }

  .email-app .inbox .message {
    position: relative;
    padding: 1rem 1rem 1rem 2rem;
    cursor: pointer;
    border-bottom: 1px solid #e1e6ef;
  }

  .email-app .inbox .message:hover {
    background: #f9f9fa;
  }

  .email-app .inbox .message .actions {
    position: absolute;
    left: 0;
    display: flex;
    flex-direction: column;
  }

  .email-app .inbox .message .actions .action {
    width: 2rem;
    margin-bottom: 0.5rem;
    color: #c0cadd;
    text-align: center;
  }

  .email-app .inbox .message a {
    color: #000;
  }

  .email-app .inbox .message a:hover {
    text-decoration: none;
  }

  .email-app .inbox .message.unread .header,
  .email-app .inbox .message.unread .title {
    font-weight: bold;
  }

  .email-app .inbox .message .header {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
  }

  .email-app .inbox .message .header .date {
    margin-left: auto;
  }

  .email-app .inbox .message .title {
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .email-app .inbox .message .description {
    font-size: 12px;
  }

  .email-app .message .toolbar {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e1e6ef;
  }

  .email-app .message .details .title {
    padding: 1rem 0;
    font-weight: bold;
  }

  .email-app .message .details .header {
    display: flex;
    padding: 1rem 0;
    margin: 1rem 0;
    border-top: 1px solid #e1e6ef;
    border-bottom: 1px solid #e1e6ef;
  }

  .email-app .message .details .header .avatar {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
  }

  .email-app .message .details .header .from {
    font-size: 12px;
    color: #9faecb;
    align-self: center;
  }

  .email-app .message .details .header .from span {
    display: block;
    font-weight: bold;
  }

  .email-app .message .details .header .date {
    margin-left: auto;
  }

  .email-app .message .details .attachments {
    padding: 1rem 0;
    margin-bottom: 1rem;
    border-top: 3px solid #f9f9fa;
    border-bottom: 3px solid #f9f9fa;
  }

  .email-app .message .details .attachments .attachment {
    display: flex;
    margin: 0.5rem 0;
    font-size: 12px;
    align-self: center;
  }

  .email-app .message .details .attachments .attachment .badge {
    margin: 0 0.5rem;
    line-height: inherit;
  }

  .email-app .message .details .attachments .attachment .menu {
    margin-left: auto;
  }

  .email-app .message .details .attachments .attachment .menu a {
    padding: 0 0.5rem;
    font-size: 14px;
    color: #e1e6ef;
  }

  @media (max-width: 767px) {
    .email-app {
      flex-direction: column;
    }
    .email-app nav {
      flex: 0 0 100%;
    }
  }

  @media (max-width: 575px) {
    .email-app .message .header {
      flex-flow: row wrap;
    }
    .email-app .message .header .date {
      flex: 0 0 100%;
    }
  }
`;