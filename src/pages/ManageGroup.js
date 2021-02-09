import React, { useEffect, useState, useCallback, Fragment } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import ManageGroupDetailModal from "../pageComponents/ManageGroup/ManageGroupDetailModal";
import dateFormat from "../dateFormat";
import styled from "styled-components";

export default function ManageGroup({ history, match }) {
  
  // ============================================================================================================
  // ================== match =====================================================================================
  // ============================================================================================================
  const { search } = match.params;
  const _search = `${search}`.split(":");
  const _searchInput = _search[0] ? _search[0] : "";    // 검색 string
  const _searchIndex = _search[1] ? _search[1] : "";    // 검색 페이지 index 
  



  // ============================================================================================================
  // ==================  states =====================================================================================
  // ============================================================================================================
  const [modalStatus, setModalStatus] = useState(false);                                  // boolean, ManageGroupDetailModal(그룹 상세 조회) on&off를 위한 state
  const [id, setId] = useState(0);                                                        // number, id = groupId, group상세 조회를 위한 조건 state
  const [groups, setGroups] = useState([]);                                               // [{}], 그룹 조회 결과받는 list state
  const [updateCount, setUpdateCount] = useState(0);                                      // number, 페이지 re-rendering state
  const [searchInput, setSearchInput] = useState(_searchInput);                           // string, 제목, 내용 검색을 위한 state
  const [pageCount, setPageCount] = useState(groups.length>0?groups[0].pageCount:10);     // number, 페이지에서 한번에 보여줄 레코드를 설정하는 state




  // ============================================================================================================
  // ===================== useEffect ===================================================================================
  // ============================================================================================================
  // 페이지 load 후 진입 점, 페이지 전체 조회
  useEffect(() => {
    selectAddressGroupAll({ groupNm: _searchInput, pageStart: _searchIndex });
  }, [search, updateCount]);





  // ============================================================================================================
  // ===================== funtions ===================================================================================
  // ============================================================================================================
  // 레코드 전체 선택 set true ol false
  // args = e(event), flag(boolean)
  const setCheckAll = (e = null, flag = false) => {
    let checkFlag = false;
    if(flag) 
      checkFlag = flag;
    else if(e!==null)
      checkFlag = e.currentTarget.checked? true: false; 
    const inputArr = document.querySelectorAll("input[type=checkbox]");
    inputArr.forEach((input)=>{input.checked = checkFlag})
  }

  // 선택된 record 배열로 리턴, 
  // return = checkedInputValues ["1","2","3"]
  const getCheckedGroupNoArr = () => {
     const inputArr = document.querySelectorAll("input[type=checkbox]");
     const checkedInputValues = [] ;
     inputArr.forEach(input=>{
       if(input.checked===true && input.value !== "on")
        checkedInputValues.push(input.value);
     });
     return checkedInputValues;  
  }

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
            history.push(`/managegroup/${_searchInput}:${parsedIndex - 1}`);
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
          history.push(`/managegroup/${_searchInput}:${i}`);
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
            history.push(`/managegroup/${_searchInput}:${parsedIndex + 1}`);
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
        emptyTrs.push(<tr>
            {emptyTds}
        </tr>)
      }
      return emptyTrs;
  }





  // ============================================================================================================
  // ================== callback =====================================================================================
  // ============================================================================================================
  // 그룹 상세 모달을 on 시키고, id를 할당시키기 위한 callback
  // args = no(number)
  // return = undefined
  const onClickDetailUseCallback = useCallback((no) => {
    setModalStatus(true);
    setId(no);
  });





// ============================================================================================================
// ===================== axios apis ===================================================================================
// ============================================================================================================
// select, 그룹 전체(검색) 조회 api
  const selectAddressGroupAll = async (addressGroup = {}) => {
    const url = "/user/selectAddressGroupAll";
    try {
      const response = await axios.post(
        url,
        { ...addressGroup },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      ).catch(function(error) {
        
        if(error.response.status===403) {
          localStorage.removeItem("jwtToken");
          history.push("/login");
        }
      });

      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회되는 그룹이 없습니다.");
          return;
        }
        setGroups(response.data.data);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
        history.push("/login");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  // delete, 그룹 삭제 api
  const deleteAddressGroup = async () => {
    const url = "/user/deleteAddressGroup";
    try {
      const response = await axios.post(
        url,
        {"addressGroupNos":getCheckedGroupNoArr()},
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("jwtToken"),
          },
        }
      ).catch(function(error) {
        
        if(error.response.status===403) {
          localStorage.removeItem("jwtToken");
          history.push("/login");
        }
      });

      if (response.data.status === "OK") {
        alert(response.data.message);
        history.push(`/managegroup/${_searchInput}:0`);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
        history.push("/login");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  
  

  // ============================================================================================================
  // ============================ HTML ====================================================================================
  // ============================================================================================================
  return (
    <div className="container-fluid">
      {modalStatus === true ? (
        <Modal
          visible={modalStatus}
          onClose={() => {
            setModalStatus(false);
          }}
          children={
            <ManageGroupDetailModal
              id={id}
              onClose={() => {
                setModalStatus(false);
              }}
              setUpdateCountGroup={() => {
                setUpdateCount(updateCount + 1);
              }}
              history={history}
            />
          }
        />
      ) : null}

      <main>
        <div className="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p className=" mr-auto">
            <h3>그룹 관리</h3>
          </p>
        </div>
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
              <input
                type="text"
                className="form-control bg-light border-0 small"
                placeholder="그룹명/그룹설명"
                aria-label="Search"
                aria-describedby="basic-addon2"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
              <button
                className="btn btn-primary mr-3"
                type="button"
                onClick={() => {
                  history.push(`/managegroup/${searchInput}:0`);
                  setUpdateCount(updateCount + 1);
                }}
              >
                🔍
              </button>
            </div>
          </form>
        </div>
        <div className="container-fluid d-flex justify-content-left">
          <button
            className="btn btn-primary rounded  mx-3 mb-3"
            onClick={() => {
              onClickDetailUseCallback(0);
            }}
          >
            생성
          </button>
          <button className="btn btn-primary rounded  mr-3 mb-3"
            onClick={()=>{deleteAddressGroup()}}
          >삭제</button>
        </div>
        <table
          id="example"
          className="table table-striped table-hover table-sm"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th scope="col">
                <input type="checkbox" onClick={(e)=>{setCheckAll(e)}}/>
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
                  <input type="checkbox" value={group.groupNo} />
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(group.groupNo);
                  }}
                >
                  {i + 1 === 10
                    ? `${parseInt(_searchIndex) + 1}${0}`
                    : `${_searchIndex}${i + 1}`}
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(group.groupNo);
                  }}
                >
                  {group.groupNm}
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(group.groupNo);
                  }}
                >
                  {group.addrCount}
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(group.groupNo);
                  }}
                >
                  {group.groupDesc}
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(group.groupNo);
                  }}
                >
                  {!group.editDate
                    ? dateFormat(new Date(group.regDate))
                    : dateFormat(new Date(group.editDate))}
                </td>
              </tr>
            ))}
            {
              groups.length < pageCount ? getEmptySpace(pageCount-groups.length, 6)
              : null
            }
          </tbody>
        </table>

        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
          <span>{groups.length > 0
              ? getPageAnchors(groups[0].recordCount, groups[0].pageCount)
              : null}</span>
        </div>
      </main>
    </div>
  );
}
