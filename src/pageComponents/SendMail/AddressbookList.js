import React,{useState, useEffect} from 'react';
import styled from "styled-components";
import axios from "axios";

export default function AddressboookList({addrNm, receiverList, setReciver, setReceiverList, history}) {
    const [addressbooks, setAddressbooks] = useState([]);

    useEffect(()=>{
        if(addrNm !== "") {
            selectAddressbookAll({"addrNm": addrNm});
        }
    },[addrNm])

    const selectAddressbookAll = async (addressbookInfo={}) => {
        const url = "/user/selectAddressbookAll";
        try {
          const response =
          await axios.post(url, 
              {...addressbookInfo}, {headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('jwtToken')
              }});
    
            if(response.data.status === "OK") {
                if(response.data.data === null) {
                  alert("조회되는 그룹이 없습니다."); return;
                }
                setAddressbooks(response.data.data);
            } else if(response.data.status === "NOT_FOUND"){
                alert("인증되지 않은 접근입니다.");
                localStorage.removeItem('jwtToken');
                history.push('/login');
            }
          } catch(err) {
            alert("서버와의 접근이 불안정합니다.");
          }
      }
   
    
    const getCheckEmail = () => {
        const checkEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
        return checkEmail.test(addrNm);
    }
     
      

    return(
       <div>
           <ul className="list-group">
               {addrNm !== "" ?
                   addressbooks.map((addressbook, i)=>{
                       return (<CustomLi 
                                key={i} 
                                className="list-group-item" 
                                value={addressbook.addrEmail}
                                onClick={
                                    ()=>{
                                        const newList = [...receiverList];
                                        newList.push({
                                            "addrNm": addressbook.addrNm,
                                            "addrEmail": addressbook.addrEmail
                                        })
                                        setReceiverList(newList);
                                        setReciver("");
                                    }
                                }
                                >
                                {`${addressbook.addrNm}:${addressbook.addrEmail}`}
                                </CustomLi>)
                   })
                   : null
               }
               {
                  getCheckEmail() ? <CustomLi 
                    className="list-group-item" 
                    onClick={()=>{
                    const newReceiverList = [...receiverList];
                     newReceiverList.push({"addrEmail": addrNm});
                     setReceiverList(newReceiverList);
                     setReciver("");
                  }}>
                        {addrNm}
                  </CustomLi> : null
                }
           </ul>
       </div>
    )
}

const CustomLi = styled.div`
    &:hover {
        background-color: #4e73df;
        color: white;
        font-weight: 700;
    }
`;