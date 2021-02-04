import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MailTemplateList({ onClose, setSendRecTplNo }) {
  const [templates, setTemplates] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [searchIndex, setSearchIndex] = useState("0");
  const [searchInput, setSearchInput] = useState("");
  const [pageCount, setPageCount] = useState(
    templates.length > 0 ? templates[0].pageCount : 10
  );

  useEffect(() => {
    selectMailTemplateAll({
      tplSub: searchInput,
      pageStart: searchIndex,
    });
  }, [updateCount]);

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
      );

      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회되는 템플릿이 없습니다.");
          return;
        }
        setTemplates(response.data.data);
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
    const parsedIndex = parseInt(searchIndex);

    if (searchIndex !== "0")
      pageAnchors.push(
        <a
          href=""
          className="btn btn-primary btn-sm mr-1"
          onClick={(e) => {
            e.preventDefault();
            setSearchIndex(parsedIndex - 1);
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
          href=""
          key={i}
          className={i == searchIndex ? currentIdxClassName : otherIdxClassName}
          onClick={(e) => {
            e.preventDefault();
            setSearchIndex(i);
            setUpdateCount(updateCount + 1);
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

    if (searchIndex !== `${pages - 1}`)
      pageAnchors.push(
        <a
          href=""
          className="btn btn-primary btn-sm mr-1"
          onClick={(e) => {
            e.preventDefault();
            setSearchIndex(parsedIndex + 1);
            setUpdateCount(updateCount + 1);
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
    <div>
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
            <button
              className="btn btn-primary mr-3"
              type="button"
              onClick={() => {
                setUpdateCount(updateCount + 1);
              }}
            >
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
            <th scope="col">템플릿 제목</th>
            <th scope="col">템플릿 설명</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((tpl, i) => (
            <tr
              key={i}
              onClick={() => {
                setSendRecTplNo(parseInt(tpl.tplNo));
                onClose();
              }}
            >
              <td>
                {i + 1 === 10
                  ? `${parseInt(searchIndex) + 1}${0}`
                  : `${searchIndex}${i + 1}`}
              </td>
              <td>{tpl.tplSub}</td>
              <td>{tpl.tplDesc}</td>
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
    </div>
  );
}
