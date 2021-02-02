import React, { useState } from "react";
import Modal from "../components/Modal";
import QAADetailModal from "../pageComponents/QuestionAndAnswer/QAADetailModal";
import RegisterQAAModal from "../pageComponents/QuestionAndAnswer/RegisterQAAModal";

import { tables } from "./sample.json";
export default function QuestionAndAnser({}) {
  const [detailModalStatus, setDetailModalStatus] = useState(false);
  const [registerModalStatus, setRegisterModalStatus] = useState(false);
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
              onChangeId={() => {}}
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
          <button
            className="btn btn-primary"
            onClick={() => {
              setRegisterModalStatus(true);
            }}
          >
            Q&A 등록
          </button>
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
              <th scope="col">구분</th>
              <th scope="col">제목</th>
              <th scope="col">답변여부</th>
              <th scope="col">등록자</th>
              <th scope="col">등록 일시</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((td, i) => (
              <tr
                key={i}
                onClick={() => {
                  setDetailModalStatus(true);
                }}
              >
                <td>{i}</td>
                <td>템플릿 관련</td>
                <td>{td.title}</td>
                <td>답변완료</td>
                <td>홍길동</td>
                <td>{td.saveDate}</td>
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
