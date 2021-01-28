import React, { useEffect, useState, useRef, Fragment, useCallback } from "react";
import Modal from "../components/Modal";
import RegisterBatchAddressbookModal from "../pageComponents/ManageAddressbook/RegisterBatchAddressbookModal";
import axios from "axios";
import styled from "styled-components";
import ManageAddressbookDetailModal from "../pageComponents/ManageAddressbook/ManageAddressbookDetailModal";

export default function ManageGroup({}) {
  //ref
  const selectRef = useRef(null);
  // state
  const [modalStatus, setModalStatus] = useState(false);
  const [classification, setClassification] = useState("whole");
  const [detailModalStatus, setDetailModalStatus] = useState(false);
  const [id, setId] = useState(0);
  const [addressbooks, setAddressbooks] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [groupDetails, setGroupDetails] = useState([]);
  const [text, setText] = useState("");
  useEffect(() => {
    selectAddressbookAll();
  },[modalStatus,classification, detailModalStatus, updateCount]);
  

  

  const selectAddressbookAll = async (addressbookInfo={}) => {
    const url = "/user/selectAddressbookAll";
    try {
      const response =
      await axios.post(url, 
          {...addressbookInfo}, {headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem('jwtToken')
          }});

        if(response.data.status === "OK") {
            if(response.data.data === null) {
              alert("조회되는 그룹이 없습니다."); return;
            }
            setAddressbooks(response.data.data);
        } else if(response.data.status === "NOT_FOUND"){
            alert("인증되지 않은 접근입니다.");
            localStorage.removeItem('jwtToken');
        }
      } catch(err) {
        alert("서버와의 접근이 불안정합니다.");
      }
  }

  const onClickDetailUseCallback = useCallback((no)=>{
      setDetailModalStatus(true);
      setId(no)
  });

  const selectGroupDetailByGroupOwner = async () => {
    const url = "/user/selectGroupDetailByGroupOwner";
    try {
        const response =
        await axios.post(url, 
            {}, {headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem('jwtToken')
            }});
  
          if(response.data.status === "OK") {
              if(response.data.data === null) {
                alert("조회되는 주소록이 없습니다."); return;
              }
              setGroupDetails(response.data.data);
          } else if(response.data.status === "NOT_FOUND"){
              alert("인증되지 않은 접근입니다.");
              localStorage.removeItem('jwtToken');
          }
        } catch(err) {
          alert("서버와의 접근이 불안정합니다.");
        }
}

  return (
    <div className="container bootdey">
      {modalStatus === true ? (
        <Modal
          visible={modalStatus}
          onClose={() => {
            setModalStatus(false);
          }}
          children={
            <RegisterBatchAddressbookModal
              onClose={() => {
                setModalStatus(false);
              }}
              onRegister={() => {
                alert("등록완료");
              }}
            />
          }
        />
      ) : null}
      {
        detailModalStatus === true ? (
          <Modal
              visible={detailModalStatus}
              onClose={()=>{setDetailModalStatus(false)}}
              children={
                <ManageAddressbookDetailModal
                  id={id}
                  onClose={()=>{setDetailModalStatus(false)}}
                />
              }
          /> 
        ) : null
      }
      <main>
        <div className="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p className="mr-auto">
            <h3>주소록 관리</h3>
          </p>
        </div>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          <label className={`btn btn-secondary ${classification==="whole"?"active":""}`}>
            <input
            type="radio"
            name="options"
            id="option2"
            autocomplete="off"
            onClick={()=>{setClassification("whole")}}
          />{" "}
            전체주소록
          </label>
          <label className={`btn btn-secondary ${classification==="group"?"active":""}`}>
            <input
            type="radio"
            name="options"
            id="option3"
            autocomplete="off"
            onClick={()=>{
              selectGroupDetailByGroupOwner();
              setClassification("group")}}
            />{" "}
            그룹별 주소록
          </label>
        </div>
        <hr className="mt-0" />
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
              {classification==="whole"?
              <Fragment>
              <input
                type="text"
                class="form-control bg-light border-0 small"
                placeholder="이름 OR EMAIL"
                aria-label="이름 OR EMAIL"
                aria-describedby="basic-addon2"
                value={text}
                onChange={(e)=>{
                  setText(e.target.value);
                }}
              />
              <button className="btn btn-primary mr-3" type="button"
                onClick={()=>{
                  selectAddressbookAll({"addrNm": text});
                }}
              >
                🔍
              </button>
              </Fragment>:
              <Fragment>
                <select ref={selectRef} className="form-control">
                  {   
                      groupDetails.map((group)=>
                          (<option key={group.groupNo} value={group.groupNo}>{group.groupNm}</option>)
                      )    
                  }
              </select>
              <button className="btn btn-primary mr-3" type="button"
                onClick={()=>{
                  const addrGroupNo = selectRef.current.selectedOptions[0].value;
                    selectAddressbookAll({"addrGroupNo":addrGroupNo});
                }}
              >
                🔍
              </button>
              </Fragment>
                }
            </div>
          </form>
        </div>
        <div className="container-fluid d-flex justify-content-left mb-3">
          <button className="btn btn-primary rounded  mx-3"
            onClick={()=>{onClickDetailUseCallback(0)}}
          >생성</button>
          <button className="btn btn-primary rounded  mr-3">삭제</button>
          <button
            className="btn btn-primary rounded  ml-auto mr-3"
            onClick={() => {
              setModalStatus(true);
            }}
          >
            EXcel 업로드
          </button>
          <button className="btn btn-primary rounded  mr-3">
            EXcel 다운로드
          </button>
        </div>
        <table
          id="example"
          className="table table-striped table-hover table-sm"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th scope="col">
                <input type="checkbox" />
              </th>
              <th scope="col">index</th>
              <th scope="col">이름</th>
              <th scope="col">소속 그룹</th>
              <th scope="col">Email 주소</th>
              <th scope="col">저장 일시</th>
            </tr>
          </thead>
          <tbody>
            {addressbooks.map((addressbook, i) => (
              <tr key={i}>
                <td scope="row">
                  <input type="checkbox" value={addressbook.addrNo}/>
                </td>
                <td onClick={()=>{onClickDetailUseCallback(addressbook.addrNo)}}>{i}</td>
                <td onClick={()=>{onClickDetailUseCallback(addressbook.addrNo)}}>{addressbook.addrNm}</td>
                <td onClick={()=>{onClickDetailUseCallback(addressbook.addrNo)}}>{addressbook.addrGroupNm}</td>
                <td onClick={()=>{onClickDetailUseCallback(addressbook.addrNo)}}>{addressbook.addrEmail}</td>
                <td hidden>{addressbook.addrGroupNo}</td>
                <td onClick={()=>{onClickDetailUseCallback(addressbook.addrNo)}}>{!addressbook.editDate?
                 addressbook.regDate : addressbook.editDate  
              }</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>index</th>
              <th>그룹명</th>
              <th>수</th>
              <th>그룹 설명</th>
              <th>저장 일시</th>
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
