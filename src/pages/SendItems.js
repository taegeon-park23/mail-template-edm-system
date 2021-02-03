import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import qs from "qs";
import dateFormat from "../dateFormat";
import TdContent from "../pageComponents/CreateTemplate/TemplateMailContents/RowTable/TdClass/TdContent";


export default function SendItems({ history, location }) {
  // query
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const _searchInput = query.searchInput ? query.searchInput : "";
  const _searchStartDate = query.searchStartDate
    ? query.searchStartDate
    : "";
    const _searchEndtDate = query.searchEndtDate
    ? query.searchEndtDate
    : "";
    const _searchIndex = query.searchIndex ? query.searchIndex : "0";
  
  // state
  const [updateCount, setUpdateCount] = useState(0);
  const [searchInput, setSearchInput] = useState(_searchInput);
  const [startDate, setStartDate] = useState(_searchStartDate);
  const [endDate, setEndDate] = useState(_searchEndtDate);
  const [sendItemList, setSendItemList] = useState([]);
  const [pageCount, setPageCount] = useState(
    sendItemList.length > 0 ? sendItemList[0].pageCount : 10
  );

  useEffect(() => {
    selectSendRecordAll(
      {
        "sendRecTitle": _searchInput,
        "startDate": _searchStartDate,
        "endDate": _searchEndtDate,
        "pageStart": _searchIndex,
      }
    );
  }, [updateCount, _searchInput, _searchStartDate, _searchEndtDate, _searchIndex]);

  const selectSendRecordAll = async (sendRecord={}) => {
    const url = "/user/selectSendRecordAll";
    try {
      const response = await axios.post(
        url,
        {...sendRecord},
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      );

      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회되는 템플릿이 없습니다.");
          return;
        }
        setSendItemList(response.data.data);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  const getPageAnchors = (recordCount, pageCount) => {
    let pages = recordCount / pageCount;
    pages = pages < 1 ? 1 : Math.round(pages);
    const pageAnchors = [];
    const parsedIndex = parseInt(_searchIndex);

    if (_searchIndex !== "0")
      pageAnchors.push(
        <a
          className="btn btn-primary btn-sm mr-1"
          onClick={(e) => {
            e.preventDefault();
            history.push(
              `/senditems?searchInput=${_searchInput}&searchIndex=${parsedIndex - 1}&searchStartDate=${_searchStartDate}&searchEndtDate=${_searchEndtDate}`
            );
          }}
        >
          {"<"}
        </a>
      );
    const currentIdxClassName = "btn btn-primary btn-sm mr-1";
    const otherIdxClassName = "btn btn-secondary btn-sm mr-1";
    const anc = (i) => {
      return (
        <a
          key={i}
          className={
            i == _searchIndex ? currentIdxClassName : otherIdxClassName
          }
          onClick={(e) => {
            e.preventDefault();
            history.push(
              `/senditems?searchInput=${_searchInput}&searchIndex=${i}&searchStartDate=${_searchStartDate}&searchEndtDate=${_searchEndtDate}`
            );
          }}
        >
          {i + 1}
        </a>
      );
    };

    for (let i = 0; i < pages; i++) {
      if ((parsedIndex === 0 && i < 5) || (parsedIndex === 1 && i < 5)) {
        pageAnchors.push(anc(i));
      } else if (i <= parsedIndex + 2 && i >= parsedIndex - 2) {
        pageAnchors.push(anc(i));
      } else if (
        (parsedIndex === pages - 1 && i + 5 >= parsedIndex) ||
        (parsedIndex === pages - 2 && i + 3 >= parsedIndex)
      ) {
        pageAnchors.push(anc(i));
      }
    }

    if (_searchIndex !== `${pages - 1}`)
      pageAnchors.push(
        <a
          className="btn btn-primary btn-sm mr-1"
          onClick={(e) => {
            e.preventDefault();
            history.push(
              `/senditems?searchInput=${_searchInput}&searchIndex=${parsedIndex + 1}&searchStartDate=${_searchStartDate}&searchEndtDate=${_searchEndtDate}`
            );
          }}
        >
          {">"}
        </a>
      );
    return pageAnchors;
  };

  const getEmptySpace = (length, tdCount) => {
    const emptyTds = [];
    const emptyTrs = [];
    
    emptyTds.push(<TdIndex>&nbsp;</TdIndex>);
    emptyTds.push(<TdTitle>&nbsp;</TdTitle>);
    emptyTds.push(<TdContent>&nbsp;</TdContent>);
    emptyTds.push(<TdDate>&nbsp;</TdDate>);
    for (let j = 0; j < length; j++) {
      emptyTrs.push(<tr>{emptyTds}</tr>);
    }
    return emptyTrs;
  };

  return (
    <div className="container-fluid">
      <main>
        <div className="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p className=" mr-auto">
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
                value={startDate}
                max={dateFormat(new Date(), 'yyyy-MM-dd')}
                onChange={
                  (e)=>{
                    setStartDate(e.target.value);
                  }
                }
              />

              {"~"}
              <input
                type="date"
                className="ml-3 form-control bg-light border-1"
                aria-label="Search"
                aria-describedby="basic-addon2"
                value={endDate}
                max={dateFormat(new Date(), 'yyyy-MM-dd')}
                onChange={
                  (e)=>{
                    setEndDate(e.target.value);
                  }
                }
              />

              <input
                type="text"
                className="ml-4 form-control bg-light border-0"
                placeholder="제목/수신자"
                aria-label="Search"
                aria-describedby="basic-addon2"
                value={searchInput}
                onChange={
                  (e)=>{
                    setSearchInput(e.target.value);
                  }
                }
              />
              <button className="btn btn-primary ml-10 mr-3" type="button"
                onClick={
                  ()=> {
                    setSearchInput("");
                    setStartDate("");
                    setEndDate("");
                  }
                }
                >
                초기화
              </button>
              <button className="btn btn-primary mr-3" type="button"
              onClick={
                ()=>{
                  history.push(
                    `/senditems?searchInput=${searchInput}&searchStartDate=${startDate}&searchEndtDate=${endDate}`
                  );
                }
              }>
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
              <ThIndex scope="col">index</ThIndex>
              <ThTitle scope="col">제목</ThTitle>
              <ThReceiver scope="col">수신자</ThReceiver>
              <ThDate scope="col">발송 일시</ThDate>
            </tr>
          </thead>
          <tbody>
            {sendItemList.map((sendItem, i) => (
              <tr
                key={i}
                onClick={() => {
                  history.push(`/senditemdetail/${sendItem.sendRecNo}`);
                }}
              >
                <TdIndex value={sendItem.sendRecNo}>
                {i + 1 === 10
                    ? `${parseInt(_searchIndex) + 1}${0}`
                    : `${_searchIndex}${i + 1}`}  
                </TdIndex>
                <TdTitle>{sendItem.sendRecTitle}</TdTitle>
                <TdReceiver>
                  {JSON.parse(sendItem.sendRecReceiver).map((addr) => {
                    return addr.addrNm
                      ? `${addr.addrNm} `
                      : `${addr.addrEmail} `;
                  })}
                </TdReceiver>
                <TdDate>{dateFormat(new Date(sendItem.regDate))}</TdDate>
              </tr>
            ))}
            {sendItemList.length < pageCount
              ? getEmptySpace(pageCount - sendItemList.length)
              : null}
          </tbody>
        </table>
        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
          <span>
            {sendItemList.length > 0
              ? getPageAnchors(
                  sendItemList[0].recordCount,
                  sendItemList[0].pageCount
                )
              : null}
          </span>
        </div>
      </main>
    </div>
  );
}

const ThIndex = styled.th`
  width: 5%;
  max-width: 5%;
  min-width: 5%;
  display: inline-block;
  text-align: center;
`;

const ThTitle = styled.th`
  width: 50%;
  max-width: 50%;
  min-width: 50%;
  display: inline-block;
  text-align: center;
`;

const ThReceiver = styled.th`
  width: 25%;
  max-width: 25%;
  min-width: 25%;
  display: inline-block;
  text-align: center;
`;

const ThDate = styled.th`
  width: 20%;
  max-width: 20%;
  min-width: 20%;
  display: inline-block;
  text-align: center;
`;

const TdIndex = styled.td`
  width: 5%;
  max-width: 5%;
  min-width: 5%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
`;

const TdTitle = styled.td`
  width: 50%;
  max-width: 50%;
  min-width: 50%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
`;

const TdReceiver = styled.td`
  width: 25%;
  max-width: 25%;
  min-width: 25%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
`;

const TdDate = styled.td`
  width: 20%;
  max-width: 20%;
  min-width: 20%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
`;
