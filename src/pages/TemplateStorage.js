import React, { useEffect, useState } from "react";
import axios from "axios";
import dateFomrat from "../dateFormat";
import qs from "qs";

export default function TemplateStorage({ history, location }) {
  // ============================================================================================================
  // ==================  query =====================================================================================
  // ============================================================================================================
  // 페이지 쿼리
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const _searchInput = query.searchInput ? query.searchInput : "";    // 검색 string
  const _searchIndex = query.searchIndex ? query.searchIndex : "0";   // 검색 페이지 page




  // ============================================================================================================
  // ==================  states =====================================================================================
  // ============================================================================================================
  const [updateCount, setUpdateCount] = useState(0);            // number, 페이지 re-rendering state
  const [templates, setTemplates] = useState([]);               // [{}], 템플릿 조회결과 받아온 template list state
  const [searchInput, setSearchInput] = useState(_searchInput); // string, 제목/내용 검색을 위한 state
  const [pageCount, setPageCount] = useState(                   // number, 페이지에서 한번에 보여줄 레코드를 설정하는 state
    templates.length > 0 ? templates[0].pageCount : 10
  );




  // ============================================================================================================
  // ===================== useEffect ===================================================================================
  // ============================================================================================================
  useEffect(() => {
    selectMailTemplateAll({
      tplSub: _searchInput,
      pageStart: _searchIndex,
    });
  }, [updateCount, _searchIndex, _searchInput]);




  // ============================================================================================================
  // ===================== funtions ===================================================================================
  // ============================================================================================================
  // 레코드 전체 선택 set true ol false
  // args = e(event), flag(boolean)
  const setCheckAll = (e = null, flag = false) => {
    let checkFlag = false;
    if (flag) checkFlag = flag;
    else if (e !== null) checkFlag = e.currentTarget.checked ? true : false;
    const inputArr = document.querySelectorAll("input[type=checkbox]");
    inputArr.forEach((input) => {
      input.checked = checkFlag;
    });
  };

  // 선택된 record 배열로 리턴, 
  // return = checkedInputValues ["1","2","3"]
  const getCheckedTplNoArr = () => {
    const inputArr = document.querySelectorAll("input[type=checkbox]");
    const checkedInputValues = [];
    inputArr.forEach((input) => {
      if (input.checked === true && input.value !== "on")
        checkedInputValues.push(input.value);
    });
    return checkedInputValues;
  };

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
              `/templatestorage?searchInput=${_searchInput}&searchIndex=${
                parsedIndex - 1
              }`
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
              `/templatestorage?searchInput=${_searchInput}&searchIndex=${i}`
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
              `/templatestorage?searchInput=${_searchInput}&searchIndex=${
                parsedIndex + 1
              }`
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
// ===================== axios apis ===================================================================================
// ============================================================================================================
// select, 메일 템플릿 전체 조회 api
const selectMailTemplateAll = async (tpl = {}) => {
    const url = "/user/selectMailTemplateAll";
    try {
      const response = await axios.post(
        url,
        { ...tpl },
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
          alert("조회되는 템플릿이 없습니다.");
          return;
        }
        setTemplates(response.data.data);
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

  // delete, 메일 템플릿 삭제 api
  const deleteMailTemplate = async () => {
    const url = "/user/deleteMailTemplate";
    try {
      const response = await axios.post(
        url,
        { tplNos: getCheckedTplNoArr() },
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
        history.push("/templatestorage");
        setCheckAll(null, false);
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
      <main>
        <div className="d-flex justify-content-center align-items-center ml-3 mt-3">
          <p className=" mr-auto">
            <h3>템플릿 목록</h3>
          </p>
        </div>
        <div className="container-fluid input-group shadow-sm py-10 mb-5 bg-white rounded">
          <form className="ml-5 mx-5 my-10">
            <div className="input-group w-100">
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
              <button className="btn btn-primary mr-3" type="button"
              onClick={() => {
                history.push(
                  `/templatestorage?searchInput=${searchInput}&searchIndex=0`
                );
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
              history.push("/createtemplate:0");
            }}
          >
            생성
          </button>
          <button
            className="btn btn-primary rounded  mr-3 mb-3"
            onClick={() => {
              deleteMailTemplate();
            }}
          >
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
              <th scope="col">
                <input
                  type="checkbox"
                  onClick={(e) => {
                    setCheckAll(e);
                  }}
                />
              </th>
              <th scope="col">index</th>
              <th scope="col">템플릿 제목</th>
              <th scope="col">템플릿 설명</th>
              <th scope="col">저장 일시</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl, i) => (
              <tr key={i}>
                <td scope="row">
                  <input type="checkbox" value={tpl.tplNo} />
                </td>
                <td
                  onClick={(e) => {
                    history.push(`/createTemplate:${tpl.tplNo}`);
                  }}
                >
                  {i + 1 === 10
                    ? `${parseInt(_searchIndex) + 1}${0}`
                    : `${_searchIndex}${i + 1}`}
                </td>
                <td
                  onClick={(e) => {
                    history.push(`/createTemplate:${tpl.tplNo}`);
                  }}
                >
                  {tpl.tplSub}
                </td>
                <td
                  onClick={(e) => {
                    history.push(`/createTemplate:${tpl.tplNo}`);
                  }}
                >
                  {tpl.tplDesc}
                </td>
                <td
                  onClick={(e) => {
                    history.push(`/createTemplate:${tpl.tplNo}`);
                  }}
                >
                  {tpl.editDate
                    ? dateFomrat(new Date(tpl.editDate))
                    : dateFomrat(new Date(tpl.regDate))}
                </td>
              </tr>
            ))}
            {templates.length < pageCount
              ? getEmptySpace(pageCount - templates.length, 5)
              : null}
          </tbody>
        </table>
        <div className="w-100 d-flex flex-row-reverse shadow-sm px-0 mb-5 bg-white rounded">
          <span>
            {templates.length > 0
              ? getPageAnchors(templates[0].recordCount, templates[0].pageCount)
              : null}
          </span>
        </div>
      </main>
    </div>
  );
}
