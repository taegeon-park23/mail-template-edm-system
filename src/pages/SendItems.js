import React, {useEffect, useState} from 'react';
import axios from "axios";
import styled from "styled-components";

export default function SendItems({}) {

  const [updateCount, setUpdateCount] = useState(0);
  const [sendItemList, setSendItemList] = useState([]);

  useEffect(()=>{
    selectSendRecordAll();
  },[updateCount])

  const selectSendRecordAll = async () => {
    const url = "/user/selectSendRecordAll";
    try {
      const response =
      await axios.post(url, 
          {}, {headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem('jwtToken')
          }});

        if(response.data.status === "OK") {
            if(response.data.data === null) {
              alert("조회되는 템플릿이 없습니다."); return;
            }
            setSendItemList(response.data.data);
        } else if(response.data.status === "NOT_FOUND"){
            alert("인증되지 않은 접근입니다.");
            localStorage.removeItem('jwtToken');
        }
      } catch(err) {
        alert("서버와의 접근이 불안정합니다.");
      }
  }

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
                title="tooltip on top"
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
              <ThIndex scope="col">index</ThIndex>
              <ThTitle scope="col">제목</ThTitle>
              <ThReceiver scope="col">수신자</ThReceiver>
              <ThDate scope="col">발송 일시</ThDate>
            </tr>
          </thead>
          <tbody>
            {sendItemList.map((sendItem, i) => (
              <tr key={i}>
                <TdIndex value={sendItem.sendRecNo}>{i}</TdIndex>
                <TdTitle>{sendItem.sendRecTitle}</TdTitle>
                <TdReceiver>{JSON.parse(sendItem.sendRecReceiver).map(
                  (addr)=>{
                    return addr.addrNm ? `${addr.addrNm} ` : `${addr.addrEmail} `
                  }
                )}</TdReceiver>
                <TdDate>{sendItem.regDate}</TdDate>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <ThIndex scope="col">index</ThIndex>
              <ThTitle scope="col">제목</ThTitle>
              <ThReceiver scope="col">수신자</ThReceiver>
              <ThDate scope="col">발송 일시</ThDate>
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

const ThIndex = styled.th`
    width: 5%;
    max-width: 5%;
    min-width: 5%;
    display:inline-block;
    text-align: center;
`;

const ThTitle = styled.th`
  width: 50%;
  max-width: 50%;
  min-width: 50%;
  display:inline-block;
  text-align: center;
`;

const ThReceiver = styled.th`
  width: 25%;
  max-width: 25%;
  min-width: 25%;
  display:inline-block;
  text-align: center;
`;

const ThDate = styled.th`
  width: 20%;
  max-width: 20%;
  min-width: 20%;
  display:inline-block;
  text-align: center;
`;

const TdIndex = styled.td`
  width: 5%;
  max-width:5%;
  min-width: 5%;
  display:inline-block;
  overflow: hidden;
  white-space: nowrap;
`;

const TdTitle = styled.td`
  width: 50%;
  max-width:50%;
  min-width:50%;
  display:inline-block;
  overflow: hidden;
  white-space: nowrap;
`;

const TdReceiver = styled.td`
  width: 25%;
  max-width:25%;
  min-width:25%;
  display:inline-block;
  overflow: hidden;
  white-space: nowrap;
`;

const TdDate = styled.td`
  width: 20%;
  max-width:20%;
  min-width:20%;
  display:inline-block;
  overflow: hidden;
  white-space: nowrap;
`;