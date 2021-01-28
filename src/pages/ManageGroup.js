import React, { useEffect, useState, useCallback } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import ManageGroupDetailModal from "../pageComponents/ManageGroup/ManageGroupDetailModal";
import styled from "styled-components";

export default function ManageGroup({}) {
  const [modalStatus, setModalStatus] = useState(false);
  const [id, setId] = useState(0);
  const [groups, setGroups] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  useEffect(() => {
    selectAddressGroupAll();
  },[updateCount]);

  const selectAddressGroupAll = async () => {
    const url = "/user/selectAddressGroupAll";
    try {
      const response =
      await axios.post(url, 
          {}, {headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem('jwtToken')
          }});

        if(response.data.status === "OK") {
            if(response.data.data === null) {
              alert("조회되는 그룹이 없습니다."); return;
            }
            setGroups(response.data.data);
        } else if(response.data.status === "NOT_FOUND"){
            alert("인증되지 않은 접근입니다.");
            localStorage.removeItem('jwtToken');
        }
      } catch(err) {
        alert("서버와의 접근이 불안정합니다.");
      }
  }

  const onClickDetailUseCallback = useCallback((no)=>{
      setModalStatus(true);
      setId(no)
  });

  return (
    <div className="container bootdey">
      {modalStatus === true ?<Modal
            visible={modalStatus}
            onClose={()=>{setModalStatus(false)}}
            children={<ManageGroupDetailModal id={id} onClose={()=>{setModalStatus(false)}} onChangeId={()=>{}}/>}
        />:null}
      <main>
        <div class="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p class=" mr-auto">
            <h3>그룹 관리</h3>
          </p>
        </div>
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
              <input
                type="text"
                class="form-control bg-light border-0 small"
                placeholder="Search for..."
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
                <button className="btn btn-primary mr-3" type="button">🔍</button>
            </div>
          </form>

        </div>
        <div className="container-fluid d-flex justify-content-left">
          <button className="btn btn-primary rounded  mx-3 mb-3"
            onClick={()=>{onClickDetailUseCallback(0)}}
          >생성</button>
          <button className="btn btn-primary rounded  mr-3 mb-3">삭제</button>
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
              <th scope="col">그룹명</th>
              <th scope="col">수</th>
              <th scope="col">그룹 설명</th>
              <th scope="col">저장 일시</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, i) => (
              <tr key={i}>
                <td scope="row">
                  <input type="checkbox" value={group.groupNo}/>
                </td>
                <td onClick={()=>{onClickDetailUseCallback(group.groupNo)}}>{i}</td>
                <td onClick={()=>{onClickDetailUseCallback(group.groupNo)}}>{group.groupNm}</td>
                <td onClick={()=>{onClickDetailUseCallback(group.groupNo)}}>{group.groupOwner}</td>
                <td onClick={()=>{onClickDetailUseCallback(group.groupNo)}}>{group.groupDesc}</td>
                <td onClick={()=>{onClickDetailUseCallback(group.groupNo)}}>{!group.editDate ? group.regDate : group.editDate}</td>
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
           <p className="p-2 bd-highlight">페이지 이동 <input type="number"></input> 1-5 of 6 &lt; &gt;</p>
        </div>
      </main>
    </div>
  );
}