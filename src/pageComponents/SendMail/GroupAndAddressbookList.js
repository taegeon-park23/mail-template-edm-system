import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

export default function GroupAndAddressbookList({
  onClose,
  setReceiverList,
  receiverList,
  history
}) {
  const [addrListInGroup, setAddrListInGroup] = useState({});
  const [addrKeys, setAddrKeys] = useState([]);
  const updateClose = 0;
  useEffect(() => {
    selectAddrDetailOrderByAddrGroupNo();
  }, [updateClose]);

  const selectAddrDetailOrderByAddrGroupNo = async (addressbookInfo = {}) => {
    const url = "/user/selectAddrDetailOrderByAddrGroupNo";
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
      })

      if (response.data.status === "OK") {
        if (response.data.data === null) {
          alert("조회되는 그룹이 없습니다.");
          return;
        } else {
          const addressbookList = response.data.data;
          const newAddrListInGroup = { ...addrListInGroup };
          const newAddrKeys = [...addrKeys];
          addressbookList.forEach((addr) => {
            if (newAddrListInGroup.hasOwnProperty(addr.addrGroupNo)) {
              newAddrListInGroup[addr.addrGroupNo]["addressbookList"].push(
                addr
              );
            } else {
              newAddrKeys.push(addr.addrGroupNo);
              newAddrListInGroup[`${addr.addrGroupNo}`] = {
                groupName: addr.addrGroupNm,
                addressbookList: [addr],
              };
            }
          });

          setAddrListInGroup(newAddrListInGroup);
          setAddrKeys(newAddrKeys);
        }
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

  const onClickAddress = (addressbook) => {
    const newList = [...receiverList];
    newList.push({
      addrNm: addressbook.addrNm,
      addrEmail: addressbook.addrEmail,
    });
    setReceiverList(newList);
    onClose(true);
  };

  const onClickGroup = (addressList) => {
    const newList = [...receiverList];
    addressList.forEach((addressbook) => {
      newList.push({
        addrNm: addressbook.addrNm,
        addrEmail: addressbook.addrEmail,
      });
    });
    setReceiverList(newList);
    onClose(true);
  };

  return (
    <div className="list-group">
      {addrKeys.length !== 0
        ? addrKeys.map((key) => (
            <Fragment>
              <a href="#" 
                className="list-group-item list-group-item-action active"
                onClick={(e)=>{
                    e.preventDefault();
                    onClickGroup(addrListInGroup[`${key}`]["addressbookList"]);
                }}
                >
                {addrListInGroup[`${key}`]["groupName"]}
              </a>
              {addrListInGroup[`${key}`]["addressbookList"].map((addr) => {
                return (
                  <a
                    href="#"
                    className="list-group-item list-group-item-action"
                    onClick={(e) => {
                      e.preventDefault();
                      onClickAddress(addr);
                    }}
                  >
                    {`${addr.addrNm}:${addr.addrEmail}`}
                  </a>
                );
              })}
            </Fragment>
          ))
        : null}
    </div>
  );
}
