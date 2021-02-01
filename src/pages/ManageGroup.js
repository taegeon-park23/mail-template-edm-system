import React, { useEffect, useState, useCallback, Fragment } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import ManageGroupDetailModal from "../pageComponents/ManageGroup/ManageGroupDetailModal";
import dateFormat from "../dateFormat";
import styled from "styled-components";

export default function ManageGroup({ history, match }) {
  
  // match
  const { search } = match.params;
  const _search = `${search}`.split(":");
  const _searchInput = _search[0] ? _search[0] : "";
  const _searchIndex = _search[1] ? _search[1] : "";
  
  // state
  const [modalStatus, setModalStatus] = useState(false);
  const [id, setId] = useState(0);
  const [groups, setGroups] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [searchInput, setSearchInput] = useState(_searchInput);
  const [pageCount, setPageCount] = useState(groups.length>0?groups[0].pageCount:10);

  useEffect(() => {
    selectAddressGroupAll({ groupNm: _searchInput, pageStart: _searchIndex });
  }, [search, updateCount]);

  const setCheckAll = (e = null, flag = false) => {
    let checkFlag = false;
    if(flag) 
      checkFlag = flag;
    else if(e!==null)
      checkFlag = e.currentTarget.checked? true: false; 
    const inputArr = document.querySelectorAll("input[type=checkbox]");
    inputArr.forEach((input)=>{input.checked = checkFlag})
  }

  const getCheckedGroupNoArr = () => {
     const inputArr = document.querySelectorAll("input[type=checkbox]");
     const checkedInputValues = [] ;
     inputArr.forEach(input=>{
       if(input.checked===true && input.value !== "on")
        checkedInputValues.push(input.value);
     });
     return checkedInputValues;  
  }

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
      );

      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회되는 그룹이 없습니다.");
          return;
        }
        setGroups(response.data.data);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

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
      );

      if (response.data.status === "OK") {
        alert(response.data.message);
        history.push(`/managegroup/${_searchInput}:0`);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
      }
    } catch (err) {
      alert("서버와의 접근이 불안정합니다.");
    }
  };

  const onClickDetailUseCallback = useCallback((no) => {
    setModalStatus(true);
    setId(no);
  });

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
            />
          }
        />
      ) : null}

      <main>
        <div class="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p class=" mr-auto">
            <h3>그룹 관리</h3>
          </p>
        </div>
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
              <input
                type="text"
                class="form-control bg-light border-0 small"
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
