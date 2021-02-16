import React, { useState, useEffect, useCallback } from "react";
import Modal from "../components/Modal";
import QAADetailModal from "../pageComponents/QuestionAndAnswer/QAADetailModal";
import RegisterQAAModal from "../pageComponents/QuestionAndAnswer/RegisterQAAModal";
import axios from 'axios';
import qs from "qs";
import dateFormat from "../../src/dateFormat";
import ReplyQAAModal from "../pageComponents/QuestionAndAnswer/ReplyQAAModal";
import { RotateLeft } from "@material-ui/icons";

import MuiModal from "@material-ui/core/Dialog";
export default function QuestionAndAnswer({ history, location }) {
  // ============================================================================================================
  // ==================  query =====================================================================================
  // ============================================================================================================
  // 페이지 쿼리
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const _searchInput = query.searchInput ? query.searchInput : "";  // 검색 string
  const _searchStartDate = query.searchStartDate                    // 검색 날짜 string(처음날짜)
  ? query.searchStartDate
  : "";                                                             // ~
  const _searchEndDate = query.searchEndDate                        // 검색 날짜 string(마지막날짜)
  ? query.searchEndDate
  : "";
  const _searchIndex = query.searchIndex ? query.searchIndex : "0"; // 검색 페이지 index 
  

  // ============================================================================================================
  // ==================  states =====================================================================================
  // ============================================================================================================
  const [detailModalStatus, setDetailModalStatus] = useState(false);                  // boolean, QAADetailModal(Q&A 상세 조회) on&off를 위한 state
  const [registerModalStatus, setRegisterModalStatus] = useState(false);              // boolean, RegisterQAAModal(Q&A 등록) on&off를 위한 state
  const [id, setId] = useState(0);                                                    // number, Q&A id를 통한 상세 조회를 위한 state
  const [qaList, setQaList] = useState([]);                                           // [{}], Q&A 조회 결과받는 list state
  const [updateCount, setUpdateCount] = useState(0);                                  // number, 페이지 re-rendering state
  const [searchInput, setSearchInput] = useState(_searchInput);                       // string, 제목 검색을 위한 state
  const [startDate, setStartDate] = useState(_searchStartDate);                       // string, 날짜 검색(시작 날짜)을 위한 state
  const [endDate, setEndDate] = useState(_searchEndDate);                             // string, 날짜 검색(마지막 날짜)을 위한 state
  const [pageCount, setPageCount] = useState(qaList.length>0?qaList[0].pageCount:10); // number, 페이지에서 한번에 보여줄 레코드를 설정하는 state
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [replyQAAModalStatus ,setReplyQAAModalStatus] = useState(false);




  // ============================================================================================================
  // ===================== useEffect ===================================================================================
  // ============================================================================================================
  // 페이지 load 후 진입 점, 페이지 전체 조회

  useEffect(()=>{
    selectQaAll({
      "qaTitle": _searchInput,
      "startDate": _searchStartDate,
      "endDate": _searchEndDate,
      "pageStart": _searchIndex,
      "role" : role
    });
  },[updateCount, _searchInput, _searchStartDate, _searchEndDate, _searchIndex])





   // ============================================================================================================
  // ===================== funtions ===================================================================================
  // ============================================================================================================
  // pages 생성 함수, 
  // args = recordCount(number), pageCount(number) 
  // return = pageAnchors [<a><a/>]
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
            history.push(`/questionandanswer?searchInput=${_searchInput}&searchIndex=${parsedIndex - 1}&searchStartDate=${_searchStartDate}&searchEndDate=${_searchEndDate}`);
            setUpdateCount(updateCount + 1);
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
        className={i == _searchIndex ? currentIdxClassName : otherIdxClassName}
        onClick={(e) => {
          e.preventDefault();
          history.push(`/questionandanswer?searchInput=${_searchInput}&searchIndex=${i}&searchStartDate=${_searchStartDate}&searchEndDate=${_searchEndDate}`);
        }}
      >
        {i + 1}
      </a>
      )
    };

    for (let i = 0; i < pages; i++) {
      if((parsedIndex===0 && i<5) || (parsedIndex===1 && i<5)) {
        pageAnchors.push(anc(i));
      } else if (i <= parsedIndex + 2 && i >= parsedIndex - 2) {
        pageAnchors.push(anc(i));
      } else if((parsedIndex===pages-1 && i+5>=parsedIndex) || (parsedIndex===pages-2 && i+3>=parsedIndex)) {
        pageAnchors.push(anc(i));
      }
    }

    if (_searchIndex !== `${pages - 1}`)
        pageAnchors.push(
        <a
          className="btn btn-primary btn-sm mr-1"
          onClick={(e) => {
            e.preventDefault();
            history.push(`/questionandanswer?searchInput=${_searchInput}&searchIndex=${parsedIndex + 1}&searchStartDate=${_searchStartDate}&searchEndDate=${_searchEndDate}`);
          }}
        >
          {">"}
        </a>
      );
    return pageAnchors;
  };

  // 테이블 공백칸 생성 함수
  // args = length(number), tdCount(number) 
  // return = emptyTrs([<td></td>])
  const getEmptySpace = (length, tdCount) => {
      const emptyTds = [];
      const emptyTrs = [];
      for(let j=0; j<tdCount; j++) {
        emptyTds.push(
          <td>&nbsp;</td>
        )
      }
      for(let j=0; j<length; j++) {
        emptyTrs.push(<tr>
            {emptyTds}
        </tr>)
      }
      return emptyTrs;
  }





  // ============================================================================================================
  // ==================  callback =====================================================================================
  // ============================================================================================================
  // Q&A 등록 모달을 on 시키고, id를 할당시키기 위한 callback
  // args = no(number)
  // return = undefined
  const onClickregisterModalCallback = useCallback((no)=>{
    setRegisterModalStatus(true);
    setId(no)
  });

  // Q&A 상세 모달을 on시키고, id를 할당시키기 위한 callback
  // args = no(number)
  // return = undefined
  const onClickQAADetailModalCallback = useCallback((no, role)=>{
    if ( role === "ADMIN") {
      setReplyQAAModalStatus(true);
      setId(no)

    } else {
      setDetailModalStatus(true);
      setId(no)
    }
    
  });


  
  
  
  
  // ============================================================================================================
  // ===================== axios apis ===================================================================================
  // ============================================================================================================
  // select, 질의응답 전체(검색) 조회 API
   const selectQaAll = async (qaInfo = {}) => {
    const url = "/user/selectQaAll";
    try {
      const response = await axios.post(url, {...qaInfo}, {headers: {
        "Content-Type" : "application/json",
        "x-auth-token" : localStorage.getItem('jwtToken')

      }}).catch(function(error) {
        
        if(error.response.status===403) {
          localStorage.removeItem("jwtToken");
          history.push("/login");
        }
      });

      if (response.data.status === 'OK') {
        if(response.data.data === null) {
          alert("조회되는 그룹이 없습니다."); return;
        }
        setQaList(response.data.data);
      } else if(response.data.status === "NOT_FOUND"){
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem('jwtToken');
        history.push('/login');
    }
    } catch(err) {
      alert("서버와의 접근이 불안정합니다.")
    }

  }




 // ============================================================================================================
  // ============================ HTML ====================================================================================
  // ============================================================================================================
  return (
    <div className="container-fluid">
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
              history={history}
              role={role}
              setUpdateCountQa={()=>{
                setUpdateCount(updateCount+1);
              }}
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
              history={history}
            />
          }
        />
      ) : null}

      {replyQAAModalStatus === true ? (
        <Modal
          visible={replyQAAModalStatus}
          onClose={() => {
            setReplyQAAModalStatus(false);
          }}
          children={
            <ReplyQAAModal
              id = {id}
              onClose={() => {
                setReplyQAAModalStatus(false);
              }}
              setUpdateCountQa={() => {
                        setUpdateCount(updateCount+1);
                      }}
              onChangeId={() => {}}
              history={history}
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
               placeholder="제목"
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
                    `/questionandanswer?searchInput=${searchInput}&searchStartDate=${startDate}&searchEndDate=${endDate}`
                  );
                }
              }>
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
            {qaList.map((list, i) => (
              <tr
                key={i}
              >
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo, role)}}>
                {i + 1 === 10
                  ? `${parseInt(_searchIndex) + 1}${0}`
                  : `${_searchIndex}${i + 1}`}  
                </td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo, role)}}>{list.qaGroup}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo, role)}}>{list.qaTitle}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo, role)}}>{list.replyYn}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo, role)}}>{list.qaUserNm}</td>
                <td onClick={()=>{onClickQAADetailModalCallback(list.qaNo, role)}}>{dateFormat(new Date(list.regDate))}</td>
              </tr>
            ))}
            {
              qaList.length < pageCount ? getEmptySpace(pageCount-qaList.length, 6)
              : null
            }
          </tbody>
        </table>
        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
          <span>
            {qaList.length > 0
              ? getPageAnchors(
                qaList[0].recordCount,
                qaList[0].pageCount
                )
              : null}
          </span>
        </div>
      </main>
    </div>
  );
}
