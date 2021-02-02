import React, { useState, useEffect } from "react";
import styled from "styled-components";
import dateFomrat from "../dateFormat";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import Modal from "../components/Modal";
import MailResponseList from "../pageComponents/SendItemDetail/MailResponseList";

export default function SendItemDetail({ match }) {
    const { number } = match.params;
  // state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [receiverList, setReceiverList] = useState([]);
  const [refList, setRefList] = useState([]);
  const [date, setDate] = useState("");
  const [tplNo, setTplNo] = useState("");
  const [tplTitle, setTplTitle] = useState("");
  const [modalStatus, setModalStatus] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    selectSendRecordBySendRecNo({
        "sendRecNo": number
    });
  }, [number]);

  const selectSendRecordBySendRecNo = async (sendItem={}) => {
    const url = "/user/selectSendRecordBySendRecNo";
    try {
      const response =
      await axios.post(url, 
          {...sendItem}, {headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem('jwtToken')
          }});

        if(response.data.status === "OK") {
            if(response.data.data === null) {
              alert("조회되는 그룹이 없습니다."); return;
            }
            const sendItem = response.data.data;
            setTitle(sendItem.sendRecTitle);
            setContent(sendItem.sendRecContent);
            setReceiverList(JSON.parse(sendItem.sendRecReceiver));
            setRefList(JSON.parse(sendItem.sendRecRefference));
            setTplNo(sendItem.sendRecTplNo);
            setTplTitle(sendItem.tplTitle);
            setDate(sendItem.regDate);
        } else if(response.data.status === "NOT_FOUND"){
            alert("인증되지 않은 접근입니다.");
            localStorage.removeItem('jwtToken');
        }
      } catch(err) {
        alert("서버와의 접근이 불안정합니다.");
      }
  }

  const getHtml = (content) => {
    try {
      const element = document.createElement('html');
       element.innerHTML = content;
       return element.getElementsByTagName('body')[0].innerHTML;
    } catch(err) {
       
    }
    return "<div>not Find</div>"
  }

  // *************************************************************************************************
  // ************************************************ HTML *******************************************
  // *************************************************************************************************

  return (
    <SendMailDiv className="container-fluid">
      <div className="email-app">
      
      {modalStatus === true ? (
        <Modal
          visible={modalStatus}
          onClose={() => {
            setModalStatus(false);
          }}
          children={
            <MailResponseList
              onClose={() => {
                setModalStatus(false);
              }}
              sendRecNo={number}
            />
          }
        />
      ) : null}

        <main>
          <div className=" mt-3">
            <p className=" mr-auto">
              <h3>보낸 메일</h3>
            </p>
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
                <div className="form-row mb-3">
                <label className="col-2 col-sm-1 col-form-label">
                  제목
                </label>
                <div className="col-10 col-sm-11">
                  <span>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      readOnly={true}
                    />
                  </span>
                </div>
              </div>
              <div className="form-row mb-3">
                <label className="col-2 col-sm-1 col-form-label">
                  받는 사람
                </label>
                <InputPrependDiv className="input-group-prepend">
                  {receiverList.map((rec, i) => {
                    return (
                      <span
                        className="badge badge-info ml-0 mr-1 my-0 px-1 py-0"
                        style={{ height: "32px", lineHeight: "32px" }}
                        title={`${rec.addrNm} ${rec.addrEmail}`}
                      >
                        {rec.addrNm ? rec.addrNm : rec.addrEmail}
                      </span>
                    );
                  })}
                </InputPrependDiv>
              </div>

              <div className="form-row mb-3">
                <label for="bcc" class="col-2 col-sm-1 col-form-label">
                  참조
                </label>
                <InputPrependDiv className="input-group-prepend">
                  {refList.map((ref, i) => {
                    return (
                      <span
                        className="badge badge-info ml-0 mr-1 my-0 px-1 py-0"
                        style={{ height: "32px", lineHeight: "32px" }}
                        title={`${ref.addrNm} ${ref.addrEmail}`}

                      >
                        {ref.addrNm ? ref.addrNm : ref.addrEmail}
                      </span>
                    );
                  })}
                </InputPrependDiv>
              </div>

              <div className="form-row mb-3">
                <div className="col"
                  onClick={()=>{
                    setModalStatus(true);
                  }}
                >
                  <span>
                    <label>메일 템플릿</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${tplNo}:${tplTitle}`}
                      readOnly={true}
                    />
                  </span>
                </div>
                <div className="col">
                  <span>
                    <label>발송 일자</label>
                    <input
                      type="text"
                      className="form-control"
                      value={dateFomrat(new Date(date))}
                      readOnly={true}
                    />
                  </span>
                </div>
              </div>

              <div className="form-row mb-3">
                <label for="bcc" class="col-2 col-sm-1 col-form-label">
                  파일
                </label>
                <div className="col-10 col-sm-11"></div>
              </div>
            </form>
          </div>
          <div className="container-fluid d-flex justify-content-center">
              <div >
                {ReactHtmlParser(getHtml(content))}
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
  max-width: 100%;
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

const SendMailDiv = styled.div``;
