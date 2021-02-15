import React, {
  useEffect,
  useState,
  useRef,
  Fragment,
  useCallback,
} from "react";
import Modal from "../components/Modal";
import RegisterBatchAddressbookModal from "../pageComponents/ManageAddressbook/RegisterBatchAddressbookModal";
import axios from "axios";
import dateFormat from "../dateFormat";
import qs from "qs";
import ManageAddressbookDetailModal from "../pageComponents/ManageAddressbook/ManageAddressbookDetailModal";

export default function ManageGroup({ history, location }) {
  // ============================================================================================================
  // ==================  query =====================================================================================
  // ============================================================================================================
  // 페이지 쿼리
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const _searchInput = query.searchInput ? query.searchInput : "";  // 검색 string
  const _searchAddrGroupNo = query.searchAddrGroupNo                // 검색 groupNo
    ? query.searchAddrGroupNo
    : 0;
  const _searchIndex = query.searchIndex ? query.searchIndex : "0";  // 검색 페이지 index  

  
  

  // ============================================================================================================
  // ================== refs =====================================================================================
  // ============================================================================================================
  const selectRef = useRef(null);

  
  


  // ============================================================================================================
  // ==================  states =====================================================================================
  // ============================================================================================================
  const [modalStatus, setModalStatus] = useState(false);                // boolean, ManageAddressbookDetailModal(주소록 상세 조회) on&off를 위한 state
  const [classification, setClassification] = useState("whole");        // string, 분류 조건 검색을 위한 state, 'whole'=전체, 'group'=그룹별
  const [detailModalStatus, setDetailModalStatus] = useState(false);    // boolean, ManageAddressbookDetailModal(주소록 상세 조회) on&off를 위한 state 
  const [id, setId] = useState(0);                                      // number, 주소록 id를 통한 상세 조회를 위한 state 
  const [addressbooks, setAddressbooks] = useState([]);                 // [{}], 주소록 조회 결과받는 list state
  const [updateCount, setUpdateCount] = useState(0);                    // number, 페이지 re-rendering state
  const [groupDetails, setGroupDetails] = useState([]);                 // [{}], 그룹 조회 결과받는 list state
  const [searchInput, setSearchInput] = useState(_searchInput);         // string, 이름/email 검색을 위한 state
  const [pageCount, setPageCount] = useState(                           // number, 페이지에서 한번에 보여줄 레코드를 설정하는 state
    addressbooks.length > 0 ? addressbooks[0].pageCount : 10
  );





  // ============================================================================================================
  // ===================== useEffect ===================================================================================
  // ============================================================================================================
  // 페이지 load 후 진입 점, 페이지 전체 조회
  useEffect(() => {
    selectAddressbookAll({
      addrGroupNo: _searchAddrGroupNo,
      addrNm: _searchInput,
      pageStart: _searchIndex,
    });
  }, [modalStatus, classification, detailModalStatus, updateCount, _searchAddrGroupNo, _searchIndex, _searchInput]);






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
            history.push(
              `/manageaddressbook?searchInput=${_searchInput}&searchIndex=${
                parsedIndex - 1
              }&searchAddrGroupNo=${_searchAddrGroupNo}`
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
              `/manageaddressbook?searchInput=${_searchInput}&searchIndex=${i}&searchAddrGroupNo=${_searchAddrGroupNo}`
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
              `/manageaddressbook?searchInput=${_searchInput}&searchIndex=${
                parsedIndex + 1
              }&searchAddrGroupNo=${_searchAddrGroupNo}`
            );
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
    for (let j = 0; j < tdCount; j++) {
      emptyTds.push(<td>&nbsp;</td>);
    }
    for (let j = 0; j < length; j++) {
      emptyTrs.push(<tr>{emptyTds}</tr>);
    }
    return emptyTrs;
  };


  

// ============================================================================================================
// ==================  callback =====================================================================================
// ============================================================================================================
// 주소록 상세 모달을 on 시키고, id를 할당시키기 위한 callback
// args = no(number)
// return = undefined
  const onClickDetailUseCallback = useCallback((no) => {
    setDetailModalStatus(true);
    setId(no);
  });





// ============================================================================================================
// ===================== axios apis ===================================================================================
// ============================================================================================================
// select, 주소록 전체(검색) 조회 api
  const selectAddressbookAll = async (addressbookInfo = {}) => {
    const url = "/user/selectAddressbookAll";
    try {
      const response = await axios.post(
        url,
        { ...addressbookInfo },
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
        setAddressbooks(response.data.data);
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

  // select, 그룹디테일 전체(검색) 조회 api
  const selectGroupDetailByGroupOwner = async () => {
    const url = "/user/selectGroupDetailByGroupOwner";
    try {
      const response = await axios.post(
        url,
        {},
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
          alert("조회되는 주소록이 없습니다.");
          return;
        }
        setGroupDetails(response.data.data);
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

  // delete, 주소록 삭제 api
  const deleteAddressbook = async () => {
    const url = "/user/deleteAddressbook";
    try {
      const response = await axios.post(
        url,
        {"addressbookNos":getCheckedGroupNoArr()},
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
        history.push(
          `/manageaddressbook?searchInput=${_searchInput}&searchIndex=${_searchIndex}&searchAddrGroupNo=${_searchAddrGroupNo}`);
        alert(response.data.message);
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
        history.push("/login");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
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
            <RegisterBatchAddressbookModal
              onClose={() => {
                setModalStatus(false);
              }}
              onRegister={() => {
                alert("등록완료");
              }}
              setUpdateCountAddressbook={() => {
                setUpdateCount(updateCount + 1);
              }}
              history={history}
            />
          }
        />
      ) : null}
      {detailModalStatus === true ? (
        <Modal
          visible={detailModalStatus}
          onClose={() => {
            setDetailModalStatus(false);
          }}
          children={
            <ManageAddressbookDetailModal
              id={id}
              onClose={() => {
                setDetailModalStatus(false);
              }}
              setUpdateCountAddressbook={() => {
                setUpdateCount(updateCount + 1);
              }}
              history={history}
            />
          }
        />
      ) : null}
      <main>
        <div className="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p className="mr-auto">
            <h3>주소록 관리</h3>
          </p>
        </div>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          <label
            className={`btn btn-secondary ${
              classification === "whole" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="options"
              id="option2"
              autoComplete="off"
              onClick={() => {
                setClassification("whole");
                history.push(
                  `/manageaddressbook?searchInput=${_searchInput}&searchIndex=0`
                );
              }}
            />{" "}
            전체주소록
          </label>
          <label
            className={`btn btn-secondary ${
              classification === "group" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="options"
              id="option3"
              autoComplete="off"
              onClick={() => {
                selectGroupDetailByGroupOwner();
                setClassification("group");
              }}
            />{" "}
            그룹별 주소록
          </label>
        </div>
        <hr className="mt-0" />
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
              {classification === "whole" ? (
                <Fragment>
                  <input
                    type="text"
                    className="form-control bg-light border-0 small"
                    placeholder="이름 OR EMAIL"
                    aria-label="이름 OR EMAIL"
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
                      history.push(
                        `/manageaddressbook?searchInput=${searchInput}&searchIndex=0`
                      );
                    }}
                  >
                    <span role="img" aria-label="search">🔍</span>
                  </button>
                </Fragment>
              ) : (
                <Fragment>
                  <select ref={selectRef} className="form-control">
                    {groupDetails.map((group) => (
                      <option key={group.groupNo} value={group.groupNo}>
                        {group.groupNm}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary mr-3"
                    type="button"
                    onClick={() => {
                      const addrGroupNo =
                        selectRef.current.selectedOptions[0].value;
                      history.push(
                        `/manageaddressbook?searchInput=${_searchInput}&searchIndex=0&searchAddrGroupNo=${addrGroupNo}`
                      );
                    }}
                  >
                      <span role="img" aria-label="search">🔍</span>
                  </button>
                </Fragment>
              )}
            </div>
          </form>
        </div>
        <div className="container-fluid d-flex justify-content-left mb-3">
          <button
            className="btn btn-primary rounded  mx-3"
            onClick={() => {
              onClickDetailUseCallback(0);
            }}
          >
            생성
          </button>
          <button className="btn btn-primary rounded  mr-3"
            onClick={()=>{deleteAddressbook()}}
          >삭제</button>
          {/* <button
            className="btn btn-primary rounded  ml-auto mr-3"
            onClick={() => {
              setModalStatus(true);
            }}
          >
            EXcel 업로드
          </button>
          <button className="btn btn-primary rounded  mr-3">
            EXcel 다운로드
          </button> */}
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
              <th scope="col">이름</th>
              <th scope="col">소속 그룹</th>
              <th scope="col">Email 주소</th>
              <th scope="col">저장 일시</th>
            </tr>
          </thead>
          <tbody>
            {addressbooks.map((addressbook, i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" value={addressbook.addrNo} />
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(addressbook.addrNo);
                  }}
                >
                  {i + 1 === 10
                    ? `${parseInt(_searchIndex) + 1}${0}`
                    : `${_searchIndex}${i + 1}`}
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(addressbook.addrNo);
                  }}
                >
                  {addressbook.addrNm}
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(addressbook.addrNo);
                  }}
                >
                  {addressbook.addrGroupNm}
                </td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(addressbook.addrNo);
                  }}
                >
                  {addressbook.addrEmail}
                </td>
                <td hidden>{addressbook.addrGroupNo}</td>
                <td
                  onClick={() => {
                    onClickDetailUseCallback(addressbook.addrNo);
                  }}
                >
                  {!addressbook.editDate
                    ? dateFormat(new Date(addressbook.regDate))
                    : dateFormat(new Date(addressbook.editDate))}
                </td>
              </tr>
            ))}
            {addressbooks.length < pageCount
              ? getEmptySpace(pageCount - addressbooks.length, 6)
              : null}
          </tbody>
        </table>
        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
          <span>
            {addressbooks.length > 0
              ? getPageAnchors(
                  addressbooks[0].recordCount,
                  addressbooks[0].pageCount
                )
              : null}
          </span>
        </div>
      </main>
    </div>
  );
}
