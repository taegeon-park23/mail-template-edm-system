import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dateFormat from "../../dateFormat";
import styled from "styled-components";
import getCheckEmail from "../../getCheckEmail";
export default function ManageAddressbookDetailModal({
  id,
  onClose,
  setUpdateCountAddressbook,
  history
}) {
  //ref
  const selectRef = useRef(null);
  // state
  const [addrNo, setAddrNo] = useState(id);
  const [addrNm, setAddrNm] = useState("");
  const [addrGroupNm, setAddrGroupNm] = useState("");
  const [addrGroupNo, setAddrGroupNo] = useState(0);
  const [addrEmail, setAddrEmail] = useState("");
  const [addrDate, setAddrDate] = useState("");
  const [updateCount, setUpdateCount] = useState(0);
  const [groupDetails, setGroupDetails] = useState([]);

  useEffect(() => {
    if (addrNo !== 0) selectOneAddressbook();
    if (addrNo === 0) selectGroupDetailByGroupOwner();
  }, [updateCount]);

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

  const selectOneAddressbook = async () => {
    const url = "/user/selectOneAddressbook";
    try {
      const response = await axios.post(
        url,
        { addrNo: addrNo },
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
        setAddrNo(response.data.data.addrNo);
        setAddrNm(response.data.data.addrNm);
        setAddrGroupNm(response.data.data.addrGroupNm);
        setAddrEmail(response.data.data.addrEmail);
        setAddrGroupNo(response.data.data.addrGroupNo);
        const regDate = response.data.data.regDate;
        const editDate = response.data.data.editDate;
        setAddrDate(!editDate ? regDate : editDate);
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

  const updateAddressbook = async () => {
    const url = "/user/updateAddressbook";
    try {
      const response = await axios.post(
        url,
        {
          addrNo: addrNo,
          addrNm: addrNm,
          addrEmail: addrEmail,
          addrGroupNo: addrGroupNo,
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
        const editDate = response.data.data;
        setAddrDate(editDate);
        setUpdateCount(updateCount + 1);
        setUpdateCountAddressbook();
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

  const insertAddressbook = async (groupNo) => {
    const url = "/user/insertAddressbook";
    try {
      const response = await axios.post(
        url,
        {
          addrNm: addrNm,
          addrEmail: addrEmail,
          addrGroupNo: groupNo,
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
        const addressbook = response.data.data;
        setAddrDate(addressbook.regDate);
        setAddrNo(addressbook.addrNo);
        setUpdateCount(updateCount + 1);
        setUpdateCountAddressbook();
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
      <h3>주소록 상세</h3>
      <hr />
      <table className="table table-bordered">
        <tbody>
          <tr>
            <LeftTd>이름</LeftTd>
            <RightTd>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setAddrNm(e.target.value);
                }}
                value={addrNm}
              />
            </RightTd>
          </tr>
          <tr>
            <LeftTd>소속 그룹</LeftTd>
            <RightTd>
              <select ref={selectRef} className="form-control">
                {addrGroupNo !== 0 ? (
                  <option value={addrGroupNo} defaultValue>
                    {addrGroupNm}
                  </option>
                ) : (
                  groupDetails.map((group) => (
                    <option key={group.groupNo} value={group.groupNo}>
                      {group.groupNm}
                    </option>
                  ))
                )}
              </select>
            </RightTd>
          </tr>
          <tr>
            <LeftTd>Email</LeftTd>
            <RightTd>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setAddrEmail(e.target.value);
                }}
                value={addrEmail}
              />
            </RightTd>
          </tr>
          <tr>
            <LeftTd>저장 일시</LeftTd>
            <RightTd>{dateFormat(new Date(addrDate))}</RightTd>
          </tr>
        </tbody>
      </table>
      <hr />
      <div className="d-flex justify-content-center">
        <button className="btn btn-secondary mr-3" onClick={onClose}>
          확인
        </button>
        {addrNo !== 0 ? (
          <button
            className="btn btn-secondary"
            onClick={() => {
              // 이메일 형식을 유지해야 한다.
              if (!getCheckEmail(addrEmail)) {
                alert("이메일 형식이 아닙니다.");
                // 빈칸을 둘 수 없다.
              } else if (
                addrEmail &&
                addrNm &&
                addrNm.length > 0 ? addrNm[0] !== " " : false &&
                addrEmail.length > 0 ? addrEmail[0] !== " " : false
              ) {
                updateAddressbook();
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
              const addrGroupNoElement = selectRef.current.selectedOptions[0];
              const addrGroupNo = addrGroupNoElement
                ? addrGroupNoElement.value
                : "";
              // 이메일 형식을 유지해야 한다.
              if (!getCheckEmail(addrEmail)) {
                alert("이메일 형식이 아닙니다.");
                // 빈칸을 둘 수 없다.
              } else if (
                addrGroupNo &&
                addrEmail &&
                addrNm &&
                addrNm.length > 0 ? addrNm[0] !== " " : false &&
                addrEmail.length > 0 ? addrEmail[0] !== " " : false
              ) {
                insertAddressbook(addrGroupNo);
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
