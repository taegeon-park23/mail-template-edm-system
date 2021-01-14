import React from 'react'
import styled from "styled-components";
import { tables } from "./sample.json";
export default function SendItems({}) {
    return(
        <div className="container bootdey">
      <main>
        <div class="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p class=" mr-auto">
            <h3>발송 이력</h3>
          </p>
        </div>
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
              <label className="mr-3">발송 일자</label>
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
              <button className="btn btn-primary ml-10 mr-3" type="button">초기화</button>
             <button className="btn btn-primary mr-3" type="button">🔍</button>
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
              <th scope="col">수신자</th>
              <th scope="col">발송 일시</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((td, i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{td.title}</td>
                <td>{td.email}</td>
                <td>{td.saveDate}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>index</th>
              <th>제목</th>
              <th>수신자</th>
              <th>발송 일시</th>
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