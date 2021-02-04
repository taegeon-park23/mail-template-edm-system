import axios from 'axios';
import React, {useEffect, useState, useContext, useCallback} from 'react'
import styled from "styled-components";
import Modal from "../components/Modal";
import NotificationDetailModal from "../pageComponents/Notification/NotificationDetailModal";
import { StateProvider } from '../stores/globalStateStore';
import { tables } from "./sample.json";
import { globalStateStore } from "../stores/globalStateStore";
import dateForm from "../../src/dateFormat";


export default function Notification({}) {
    const [modalStatus, setModalStatus] = useState(false);
    const globalState = useContext(globalStateStore);
    const [notices, setNotices] = useState([]);
    const [updateCount, setUpdateCount] = useState(0);
    const { state } = globalState;
    const [notificationDetailModalStatus, setNotificationDetailModalStatus] = useState(false);
    const [id, setId] = useState(0);

    //call all notice list
    const selectNoticeAll = async () => {
      const url = "http://localhost:8080/notice/selectNoticeAll";
      try {
        const response = await axios.post(url, {}, {headers: {
          "Content-Type" : "application/json",
          "x-auth-token" : localStorage.getItem('jwtToken')
        }});

        if (response.data.status === 'OK') {
          setNotices(response.data.data);
        }
      } catch(err) {
        if(err.response.status === 403) {
          alert("인증되지 않은 접근입니다.");
          globalState.dispatch({type:"UPDATE_JWT_TOKEN", value:{jwtToken: null}});
        } else {
          alert("서버와의 접근이 불안정합니다.")
        }
      }

    }

    useEffect(()=>{
      selectNoticeAll();
    },[updateCount])
  

    const onClickNotificationDetailModallCallback = useCallback((no)=>{
      setModalStatus(true);
      setId(no)
    });

    return(
        <div className="container bootdey">
        {modalStatus === true ? (
        <Modal
          visible={modalStatus}
          onClose={() => {
            setModalStatus(false);
          }}
          children={
            <NotificationDetailModal
              id = {id}
              onClose={() => {
                setModalStatus(false);
              }}
              onChangeId={() => {}}
            />
          }
        />
      ) : null}

      <main>
        <div class="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p class=" mr-auto">
            <h3>공지 사항</h3>
          </p>
        </div>
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
              <label className="mr-3">등록 일자</label>
              <input
                type="date"
                className="mr-3 form-control bg-light border-1"
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
              {"~"}
              <input
                type="date"
                className="ml-3 form-control bg-light border-1"
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
              <input
                type="text"
                class="ml-4 form-control bg-light border-0"
                placeholder="제목/수신자"
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
              <button className="btn btn-primary mr-3" type="button">
                <span role="img" aria-label="search">
                  🔍
                </span>
              </button>
            </div>
          </form>
        </div>
        <table
          id="example"
          className="table table-striped table-hover table-sm"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th scope="col">index</th>
              <th scope="col">제목</th>
              <th scope="col">파일</th>
              <th scope="col">등록 일시</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice, i) => (
              <tr key={i} onClick={()=>{setModalStatus(true)}}>
                <td onClick={()=>{onClickNotificationDetailModallCallback(notice.noticeNo)}}>{i+1}</td>
                <td onClick={()=>{onClickNotificationDetailModallCallback(notice.noticeNo)}}>{notice.noticeTitle}</td>
                <td onClick={()=>{onClickNotificationDetailModallCallback(notice.noticeNo)}}>{notice.noticeAttachment}</td>
                <td onClick={()=>{onClickNotificationDetailModallCallback(notice.noticeNo)}}>{dateForm(new Date(notice.regDate))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>index</th>
              <th>제목</th>
              <th>파일</th>
              <th>등록 일시</th>
            </tr>
          </tfoot>
        </table>
        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
          <p className="p-2 bd-highlight">
            페이지 이동 <input type="number"></input> 1-5 of 6 &lt; &gt;
          </p>
        </div>
      </main>
    </div>
  );
}
