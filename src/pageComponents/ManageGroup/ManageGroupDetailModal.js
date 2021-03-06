import React, { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "../../dateFormat";
import styled from "styled-components";
export default function ManageGroupDetailModal({
  id,
  onClose,
  setUpdateCountGroup,
  history
}) {
  const [groupNo, setGroupNo] = useState(id);
  const [groupNm, setGroupNm] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupDate, setGroupDate] = useState("");
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    if (groupNo !== 0) selectOneAddressGroup();
  }, updateCount);

  const selectOneAddressGroup = async () => {
    const url = "/user/selectOneAddressGroup";
    try {
      const response = await axios.post(
        url,
        { groupNo: groupNo },
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
        setGroupNo(response.data.data.groupNo);
        setGroupNm(response.data.data.groupNm);
        setGroupDesc(response.data.data.groupDesc);
        const regDate = response.data.data.regDate;
        const editDate = response.data.data.editDate;
        setGroupDate(!editDate ? regDate : editDate);
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

  const updateAddressGroup = async () => {
    const url = "/user/updateAddressGroup";
    try {
      const response = await axios.post(
        url,
        { groupNo: groupNo, groupNm: groupNm, groupDesc: groupDesc },
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
        alert(response.data.message);
        const editDate = response.data.data;
        setGroupDate(editDate);
        setUpdateCount(updateCount + 1);
        setUpdateCountGroup();
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

  const insertAddressGroup = async () => {
    const url = "/user/insertAddressGroup";
    try {
      const response = await axios.post(
        url,
        {
          groupNm: groupNm,
          groupDesc: groupDesc,
        },
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
        alert(response.data.message);
        const group = response.data.data;
        setGroupDate(group.regDate);
        setGroupNo(group.groupNo);
        setUpdateCount(updateCount + 1);
        setUpdateCountGroup();
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

  return (
    <div>
      <h3>공지사항 상세</h3>
      <hr />
      <table className="table table-bordered">
        <tbody>
          <tr>
            <LeftTd>그룹명</LeftTd>
            <RightTd>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setGroupNm(e.target.value);
                }}
                value={groupNm}
              />
            </RightTd>
          </tr>
          <tr>
            <LeftTd>수</LeftTd>
            <RightTd>수</RightTd>
          </tr>
          <tr>
            <LeftTd>그룹 설명</LeftTd>
            <RightTd>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setGroupDesc(e.target.value);
                }}
                value={groupDesc}
              />
            </RightTd>
          </tr>
          <tr>
            <LeftTd>저장 일시</LeftTd>
            <RightTd>{dateFormat(new Date(groupDate))}</RightTd>
          </tr>
        </tbody>
      </table>
      <hr />
      <div className="d-flex justify-content-center">
        <button className="btn btn-secondary mr-3" onClick={onClose}>
          확인
        </button>
        {groupNo !== 0 ? (
          <button
            className="btn btn-secondary"
            onClick={() => {
              // 빈칸이나 공백을 둘 수 없다.
              if (
                groupNm &&
                groupDesc &&
                groupNm.indexOf(" ") === -1 &&
                groupDesc.length > 0 ? groupDesc[0] !== " " : false 
              ) {
                updateAddressGroup();
              } else {
                alert("칸을 비울 수 없습니다.");
              }
            }}
          >
            수정
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={() => {
              // 빈칸이나 공백을 둘 수 없다.
              if (
                groupNm &&
                groupDesc &&
                groupNm.indexOf(" ") === -1 &&
                groupDesc.length > 0 ? groupDesc[0] !== " " : false
              ) {
                insertAddressGroup();
              } else {
                alert("칸을 비울 수 없습니다.");
              }
            }}
          >
            저장
          </button>
        )}
      </div>
    </div>
  );
}

const LeftTd = styled.td`
  width: 30%;
`;

const RightTd = styled.td`
  width: 70%;
`;
