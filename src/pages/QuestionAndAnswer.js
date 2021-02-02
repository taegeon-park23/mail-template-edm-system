import React, { useState, useContext, useEffect, useCallback } from "react";
import styled from "styled-components";
import Modal from "../components/Modal";
import QAADetailModal from "../pageComponents/QuestionAndAnswer/QAADetailModal";
import RegisterQAAModal from "../pageComponents/QuestionAndAnswer/RegisterQAAModal";
import axios from 'axios';
import { globalStateStore } from "../stores/globalStateStore";

export default function QuestionAndAnser({}) {
  const [detailModalStatus, setDetailModalStatus] = useState(false);
  const [registerModalStatus, setRegisterModalStatus] = useState(false);
  const [id, setId] = useState(0);
  const globalState = useContext(globalStateStore);
  const [qaList, setQaList] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);



  const onClickregisterModalCallback = useCallback((no)=>{
    setRegisterModalStatus(true);
    setId(no)
  });

  const onClickQAADetailModalCallback = useCallback((no)=>{
    setDetailModalStatus(true);
    setId(no)
  });


   //call all qa List
   const selectQaAll = async () => {
    const url = "http://localhost:8080/qa/selectQaAll";
    try {
      const response = await axios.post(url, {}, {headers: {
        "Content-Type" : "application/json",
        "x-auth-token" : localStorage.getItem('jwtToken')

      }});

      if (response.data.status === 'OK') {
        if(response.data.data === null) {
          alert("조회되는 그룹이 없습니다."); return;
        }

        setQaList(response.data.data);
      } else if(response.data.status === "NOT_FOUND"){
        alert("인증되지 않은 접근입니다.");

        localStorage.removeItem('jwtToken');
    }
    } catch(err) {
      alert("서버와의 접근이 불안정합니다.")
    }

  }

  

  useEffect(()=>{
    selectQaAll();
  },[updateCount])




  return (
    <div className="container bootdey">
      {detailModalStatus === true ? (
        <Modal
          visible={detailModalStatus}
          onClose={() => {
            setDetailModalStatus(false);
          }}
          children={
            <QAADetailModal
              id = {id}
              onClose={() => {
                setDetailModalStatus(false);
              }}
              onChangeId={() => {}}
            />
          }
        />
      ) : null}
      {registerModalStatus === true ? (
        <Modal
          visible={registerModalStatus}
          onClose={() => {
            setRegisterModalStatus(false);
          }}
          children={
            <RegisterQAAModal
              onClose={() => {
                setRegisterModalStatus(false);
              }}
              setUpdateCountQa={() => {
                setUpdateCount(updateCount+1);
              }}

            />
          }
        />
      ) : null}

      <main>
        <div className="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p className=" mr-auto">
            <h3>Q&A</h3>
          </p>
        </div>
        <div className="w-100 mb-2 d-flex flex-row-reverse">
          <button className="btn btn-primary" onClick={()=>{onClickregisterModalCallback(0)}}>Q&A 등록</button>
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
                🔍
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
              <th scope="col">구분</th>
              <th scope="col">제목</th>
              <th scope="col">답변여부</th>
              <th scope="col">등록자</th>
              <th scope="col">등록 일시</th>
            </tr>
          </thead>
          <tbody>
            {qaList.map((list, i) => (
              <tr
                key={i}
              >
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo)}}>{i+1}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo)}}>{list.qaGroup}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo)}}>{list.qaTitle}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo)}}>{list.replyYn}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo)}}>{list.qaUserNm}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo)}}>{list.regDate}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>index</th>
              <th>구분</th>
              <th>제목</th>
              <th>답변여부</th>
              <th>등록자</th>
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
