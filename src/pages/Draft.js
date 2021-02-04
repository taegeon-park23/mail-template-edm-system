import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import dateFormat from "../dateFormat";

export default function Draft({ history, location }) {
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
  const [draftList, setDraftList] = useState([]);
  const [pageCount, setPageCount] = useState(
    draftList.length > 0 ? draftList[0].pageCount : 10
  );

  useEffect(() => {
    selectMailDraftAll(
      {
        "draftTitle": _searchInput,
        "startDate": _searchStartDate,
        "pageStart": _searchIndex,
      }
    );
  }, [updateCount, _searchInput, _searchStartDate, _searchIndex]);

  const setCheckAll = (e = null, flag = false) => {
    let checkFlag = false;
    if (flag) checkFlag = flag;
    else if (e !== null) checkFlag = e.currentTarget.checked ? true : false;
    const inputArr = document.querySelectorAll("input[type=checkbox]");
    inputArr.forEach((input) => {
      input.checked = checkFlag;
    });
  };

  const getCheckedDraftNoArr = () => {
    const inputArr = document.querySelectorAll("input[type=checkbox]");
    const checkedInputValues = [];
    inputArr.forEach((input) => {
      if (input.checked === true && input.value !== "on")
        checkedInputValues.push(input.value);
    });
    return checkedInputValues;
  };

  const selectMailDraftAll = async (draft={}) => {
    const url = "/user/selectMailDraftAll";
    try {
      const response = await axios.post(
        url,
        {...draft},
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      );

      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회되는 임시메일이 없습니다.");
          return;
        }
        setDraftList(response.data.data);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  const deleteMailDraft = async () => {
    const url = "/user/deleteMailDraft";
    try {
      const response = await axios.post(
        url,
        { draftNos: getCheckedDraftNoArr() },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      );
      if (response.data.status === "OK") {
        alert(response.data.message);
        history.push(
          `/draft?searchInput=${_searchInput}&searchIndex=${_searchIndex}&searchStartDate=${_searchStartDate}`
        );
        setCheckAll(null, false);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  const getPageAnchors = (recordCount, pageCount) => {
    let pages = recordCount / pageCount;
    pages = pages < 1 ? 1 : Math.ceil(pages);
    const pageAnchors = [];
    const parsedIndex = parseInt(_searchIndex);

    if (_searchIndex !== "0")
      pageAnchors.push(
        <a
          className="btn btn-primary btn-sm mr-1"
          onClick={(e) => {
            e.preventDefault();
            history.push(
              `/draft?searchInput=${_searchInput}&searchIndex=${parsedIndex - 1}&searchStartDate=${_searchStartDate}`
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
              `/draft?searchInput=${_searchInput}&searchIndex=${i}&searchStartDate=${_searchStartDate}`
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
              `/draft?searchInput=${_searchInput}&searchIndex=${parsedIndex + 1}&searchStartDate=${_searchStartDate}`
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
    for (let j = 0; j < tdCount; j++) {
      emptyTds.push(<td>&nbsp;</td>);
    }
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
            <h3>임시 보관함</h3>
          </p>
        </div>
        <div className="input-group shadow-sm px-0 mb-5 bg-white rounded">
          <div className="form-group">
            <input type="month" className="form-control" 
              value={startDate}
              onChange={(e)=>{
                setStartDate(e.target.value);
              }}
            />
          </div>
          <form className="ml-auto mx-5">
            <div className="input-group w-100">
              <input
                type="text"
                className="form-control bg-light border-0 small"
                placeholder="제목/받은사람"
                aria-label="Search"
                aria-describedby="basic-addon2"
                value={searchInput}
                onChange={(e)=>{
                  setSearchInput(e.target.value);
                }}
              />
                <button className="btn btn-primary mr-3" type="button"
                  onClick={()=>{
                    history.push(
                      `/draft?searchInput=${searchInput}&searchIndex=0&searchStartDate=${startDate}`
                    );
                  }}
                >🔍</button>
                <button className="btn btn-primary rounded mr-3"
                onClick={()=>{
                  setSearchInput("");
                  setStartDate("");
                }}
                >초기화</button>
            </div>
          </form>

        </div>
        <div className="container-fluid d-flex justify-content-right">
          <button className="btn btn-primary rounded ml-auto mr-3 mb-3"
          onClick={()=>{
            deleteMailDraft();
          }}>
            삭제
          </button>
        </div>
        <table
          id="example"
          className="table table-striped table-hover table-sm"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <input
                  type="checkbox"
                  onClick={(e) => {
                    setCheckAll(e);
                  }}
                />
              <th scope="col">index</th>
              <th scope="col">받는사람</th>
              <th scope="col">제목</th>
              <th scope="col">저장 일시</th>
            </tr>
          </thead>
          <tbody>
            {draftList.map((dr, i) => (
              <tr key={i}>
                <td scope="row">
                  <input type="checkbox" value={dr.draftNo}/>
                </td>
                <td onClick={()=>{
                  history.push(`/sendmail/${dr.draftNo}`);
                }}>
                {i + 1 === 10
                    ? `${parseInt(_searchIndex) + 1}${0}`
                    : `${_searchIndex}${i + 1}`}    
                </td>
                <td onClick={()=>{
                  history.push(`/sendmail/${dr.draftNo}`);
                }}>
                  {JSON.parse(dr.draftReceiver).map((addr) => {
                    return addr.addrNm
                      ? `${addr.addrNm} `
                      : `${addr.addrEmail} `;
                  })}</td>
                <td onClick={()=>{
                  history.push(`/sendmail/${dr.draftNo}`);
                }}>
                  {dr.draftTitle}</td>
                  <td onClick={()=>{
                  history.push(`/sendmail/${dr.draftNo}`);
                }}>
                  {dateFormat(new Date(dr.regDate))}</td>
              </tr>
            ))}
            {draftList.length < pageCount
              ? getEmptySpace(pageCount - draftList.length, 5)
              : null}
          </tbody>
        </table>
        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
          <span>
            {draftList.length > 0
              ? getPageAnchors(
                draftList[0].recordCount,
                draftList[0].pageCount
                )
              : null}
          </span>
        </div>
      </main>
    </div>
  );
}