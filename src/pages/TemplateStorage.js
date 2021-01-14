import React from 'react'
import styled from "styled-components";
import { tables } from "./sample.json";
export default function TemplateStorage({}) {
    return(
        <div className="container bootdey">
      <main>
        <div class="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p class=" mr-auto">
            <h3>템플릿 목록</h3>
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
          <button className="btn btn-primary rounded  mx-3 mb-3">생성</button>
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
              <th scope="col">템플릿 제목</th>
              <th scope="col">첨부 파일</th>
              <th scope="col">템플릿 설명</th>
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
           <p className="p-2 bd-highlight">페이지 이동 <input type="number"></input> 1-5 of 6 &lt; &gt;</p>
        </div>
      </main>
    </div>
    )
}