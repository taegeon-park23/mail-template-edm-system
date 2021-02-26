import axios from 'axios';
import React, {useEffect, useState, useContext, useCallback} from 'react'
import styled from "styled-components";
import Modal1 from "../components/Modal";
import Modal from "@material-ui/core/Dialog";
import qs from "qs";
import dateForm from "../../src/dateFormat";
import UserDetailModal from "../pageComponents/manageUsers/UserDetailModal";

export default function ManageUsers({ history, location }) {
  // ============================================================================================================
  // ==================  query =====================================================================================
  // ============================================================================================================
  // 페이지 쿼리
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const _searchInput = query.searchInput ? query.searchInput : ""; // 검색 string
  const _searchStartDate = query.searchStartDate                   // 검색 날짜 string(처음날짜)
  ? query.searchStartDate
  : "";                                                            // ~
  const _searchEndDate = query.searchEndDate                       // 검색 날짜 string(마지막날짜)
  ? query.searchEndDate
  : "";

  const _searchIndex = query.searchIndex ? query.searchIndex : "0"; // 검색 페이지 index 




  // ============================================================================================================
  // ==================  states =====================================================================================
  // ============================================================================================================
  const [detailModalStatus, setDetailModalStatus] = useState(false);                                  // boolean, NotificationDetailModal(공지사항 상세 조회) on&off를 위한 state
  const [userList, setUserList] = useState([]);                                             // [{}], 전체 유저 목록을 받는 list state
  const [updateCount, setUpdateCount] = useState(0);                                      // number, 페이지 re-rendering state
  const [searchInput, setSearchInput] = useState(_searchInput);                           // string, 이름 검색을 위한 state
  const [startDate, setStartDate] = useState(_searchStartDate);                           // string, 날짜 검색(시작 날짜)을 위한 state
  const [endDate, setEndDate] = useState(_searchEndDate);                                 // string, 날짜 검색(마지막 날짜)을 위한 state
  const [pageCount, setPageCount] = useState(userList.length>0?userList[0].pageCount:10);   // number, 페이지에서 한번에 보여줄 레코드를 설정하는 state
  const [users, setUsers] = useState();




  // ============================================================================================================
  // ===================== useEffect ===================================================================================
  // ============================================================================================================
  useEffect(()=>{
    selectAllUsers(
      {
        "userNm": _searchInput,
        "startDate": _searchStartDate,
        "endDate": _searchEndDate,
        "pageStart": _searchIndex,
      }
    );
  },[updateCount,_searchInput, _searchStartDate, _searchEndDate, _searchIndex])





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
            history.push(`/manageUsers?searchInput=${_searchInput}&searchIndex=${parsedIndex - 1}&searchStartDate=${_searchStartDate}&searchEndDate=${_searchEndDate}`);
            setUpdateCount(updateCount + 1);
          }}
        >
          {"<"}
        </a>
      );
    const currentIdxClassName = "btn btn-primary btn-sm mr-1";
    const otherIdxClassName = "btn btn-secondary btn-sm mr-1";
    const anc = (i) => {
      return <a
        key={i}
        className={i == _searchIndex ? currentIdxClassName : otherIdxClassName}
        onClick={(e) => {
          e.preventDefault();
          history.push(`/manageUsers?searchInput=${_searchInput}&searchIndex=${i}&searchStartDate=${_searchStartDate}&searchEndDate=${_searchEndDate}`);
        }}
      >
        {i + 1}
      </a>
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
            history.push(`/manageUsers?searchInput=${_searchInput}&searchIndex=${parsedIndex + 1}&searchStartDate=${_searchStartDate}&searchEndDate=${_searchEndDate}`);
          }}
        >
          {">"}
        </a>
      );
    return pageAnchors;
  };

  // 테이블 공백칸 생성
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
        emptyTrs.push(
        <tr>
            {emptyTds}
        </tr>)
      }
      return emptyTrs;
  }


  // User 상세정보 Modal Callback
  const userDetailCallback = useCallback((users)=>{
    setUsers(users);
    setDetailModalStatus(true);
    console.log(users);
  });

  
  







  // ============================================================================================================
  // ===================== axios apis ===================================================================================
  // ============================================================================================================
  // select, 공지사항 전체(검색) 조회 API
  const selectAllUsers = async (userInfo={}) => {
    const url = "/admin/user/selectAllUsers";
    try {
      const response = await axios.post(
        url,
        {...userInfo},
        {headers: {
          "Content-Type" : "application/json",
          "x-auth-token" : localStorage.getItem('jwtToken')
          }
        }).catch(function(error) {
        
        if(error.response.status===403) {
          localStorage.removeItem("jwtToken");
          history.push("/login");
        }
      });

      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회된 사용자 LIST가 없습니다.");
          return;
        }

        setUserList(response.data.data);

      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
        history.push("/loign");
      } else {
        alert(response.data.message);
      }

    } catch(err) {
        alert("서버와 연결이 되지 않습니다.")
    }
  }

  
  // ============================================================================================================
  // ============================ HTML ====================================================================================
  // ============================================================================================================
    return(
      <div className="container-fluid">
        {detailModalStatus === true ?<Modal1
            visible={detailModalStatus}
            onClose={()=>{setDetailModalStatus(false)}}
            children={<UserDetailModal
              users={users}
              onClose={()=>{setDetailModalStatus(false)}} 
              history={history}
              setUpdateCountManageUser={()=>{
                setUpdateCount(updateCount+1);
              }}
              />}
        />:null}

      <main>
        <div className="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p className=" mr-auto">
            <h3>사용자 계정 목록</h3>
          </p>
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
                max={dateForm(new Date(), 'yyyy-MM-dd')}
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
                max={dateForm(new Date(), 'yyyy-MM-dd')}
                onChange={
                  (e)=>{
                    setEndDate(e.target.value);
                  }
                }
              />
              <input
                type="text"
                className="ml-4 form-control bg-light border-0"
                placeholder="이름"
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
                    `/manageUsers?searchInput=${searchInput}&searchStartDate=${startDate}&searchEndDate=${endDate}`
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
          id="userListTable"
          className="table table-striped table-hover table-sm"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th scope="col">index</th>
              <th scope="col">아이디</th>
              <th scope="col">이름</th>
              <th scope="col">소속부서</th>
              <th scope="col">PHONE</th>
              <th scope="col">EMAIL</th>
              <th scope="col">계정권한</th>
              <th scope="col">계정상태</th>
              <th scope="col">등록일시</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((users, i) => (
              <tr key={i} onClick={()=>{setDetailModalStatus(true)}}>
                <td onClick={()=>{userDetailCallback(users)}}>
                  {i+1 ===10 ? `${parseInt(_searchIndex) + 1}${0}` :  `${_searchIndex}${i + 1}`}
                </td>
                <td onClick={()=>{userDetailCallback(users)}}>{users.userId}</td>
                <td onClick={()=>{userDetailCallback(users)}}>{users.userNm}</td>
                <td onClick={()=>{userDetailCallback(users)}}>{users.userDpt}</td>
                <td onClick={()=>{userDetailCallback(users)}}>{users.userPhone}</td>
                <td onClick={()=>{userDetailCallback(users)}}>{users.userEmail}</td>
                <td onClick={()=>{userDetailCallback(users)}}>{users.role}</td>
                <td onClick={()=>{userDetailCallback(users)}}>{users.statusForString}</td>
                <td onClick={()=>{userDetailCallback(users)}}>{dateForm(new Date(users.regDate))}</td>
              </tr>
            ))}
            {
              userList.length < pageCount ? getEmptySpace(pageCount-userList.length, 7)
              : null
            }
          </tbody>
        </table>
        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
          <span>
            {userList.length > 0
              ? getPageAnchors(
                userList[0].recordCount,
                userList[0].pageCount
                )
              : null}
          </span>
        </div>
      </main>
    </div>
  );
}
