import React, { useEffect, useState, useRef, Fragment } from "react";
import Modal from "../components/Modal";
import RegisterBatchAddressbookModal from "../pageComponents/ManageAddressbook/RegisterBatchAddressbookModal";
import styled from "styled-components";
import { tables } from "./sample.json";

export default function ManageGroup({}) {
  const [modalStatus, setModalStatus] = useState(false);
  const [classification, setClassification] = useState("whole");
  useEffect(() => {
  },[modalStatus,classification]);
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
            onClick={()=>{setClassification("group")}}
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
                placeholder="Search for..."
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
              <button className="btn btn-primary mr-3" type="button">
                🔍
              </button>
              </Fragment>:
              <Fragment>
                <select 
                className="form-control custom-select bg-light border-0 small"
                aria-label="Search"
                aria-describedby="basic-addon2"
              >
                  <option selected>group</option>
                  <option >group1</option>
                  <option >group2</option>
              </select>
              <button className="btn btn-primary mr-3" type="button">
                🔍
              </button>
              </Fragment>
                }
            </div>
          </form>
        </div>
        <div className="container-fluid d-flex justify-content-left mb-3">
          <button className="btn btn-primary rounded  mx-3">생성</button>
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
            {tables.map((td, i) => (
              <tr key={i}>
                <td scope="row">
                  <input type="checkbox" />
                </td>
                <td>{i}</td>
                <td>{td.email}</td>
                <td>{td.attachments}</td>
                <td>{td.title}</td>
                <td>{td.saveDate}</td>
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
