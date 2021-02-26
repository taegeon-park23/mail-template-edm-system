import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import styled from "styled-components";
import dateFormat from "../../dateFormat";

export default function UserDetailModal({users, onClose, setUpdateCountManageUser, history}) {



    // ============================================================================================================
    // ==================  states =====================================================================================
    // ============================================================================================================
    

    const [userId, setUserId] = useState(users.userId);
    const [userNm, setUserNm] = useState(users.userNm);
    const [userDpt, setUserDpt] = useState(users.userDpt);
    const [userPhone, setUserPhone] = useState(users.userPhone);
    const [userEmail, setUserEmail] = useState(users.userEmail);
    const [userRole, setUserRole] = useState(users.role);
    const [useStatus, setUseStatus] = useState(users.useStatus);
    const [editDate, setEditDate] = useState(users.editDate);
    const [editor, setEditor] = useState(users.editor);
    const [regDate, setRegDate] = useState(users.regDate);
    const [regId, setRegId] = useState(users.regId);

    const [userInfo, setUserInfo] = useState();
    const [updateCount, setUpdateCount] = useState(0);

    






    useEffect(()=>{
        

    }, [updateCount]);

    // 유저용 삭제버튼
    const deleteBtn = (role) => {
        if ( role === "USER" ) {
            return (
                <button className="btn btn-secondary mr-3" onClick={()=>{
                    if(window.confirm('삭제하시겠습니까?')) {
                        onClose();
                        // deleteQa();
                    } 
                }}>삭제</button>
            )
        } else {
            return ;
        }
    }


    // const selectUser = async () => {
    //     const url = "/admin/user/selectUser";
    //     try {
    //       const response =
    //       await axios.post(
    //           url, 
    //           {"userNm": userNm}, 
    //           {headers: {
    //             "Content-Type": "application/json",
    //             "x-auth-token": localStorage.getItem('jwtToken')
    //           }});
    
    //         if(response.data.status === "OK") {
    //             if(response.data.data === null) {
    //               alert("조회된 사용자가 없습니다."); 
    //               return;
    //             }

    //             setUserInfo(response.data.data);
                                
    //         } else if(response.data.status === "NOT_FOUND"){
    //             alert("인증되지 않은 접근입니다.");
    //             localStorage.removeItem('jwtToken');
    //             history.push('/login');
    //         }
    //       } catch(err) {
    //         alert("서버와 연결이 되지 않습니다.");
    //       }
    //   }


    //   const deleteQa = async () => {
    //     const url = "/admin/qa/deleteQa";
    //     try {
    //       const response = await axios.post(
    //         url,
    //         {"qaNo": qaNo},
    //         {
    //           headers: {
    //             "Content-Type": "application/json",
    //             "x-auth-token": localStorage.getItem("jwtToken"),
    //           },
    //         }
    //       ).catch(function(error) {
            
    //         if(error.response.status===403) {
    //           localStorage.removeItem("jwtToken");
    //           history.push("/login");
    //         }
    //       });
    
    //       if (response.data.status === "OK") {
    //         setUpdateCountManageUser();
    //         onClose();
    //         history.push("/questionandanswer");
    //       } else if (response.data.status === "NOT_FOUND") {
    //         alert("인증되지 않은 접근입니다.");
    //         localStorage.removeItem("jwtToken");
    //         history.push("/login");
    //       } else {
    //         alert(response.data.message);
    //       }
    //     } catch (err) {
    //       alert("서버와의 접근이 불안정합니다.");
    //     }
    //   };

    
  const updateUserInfo = async () => {
    const url = "/admin/user/updateUser";
    try {
      const response = await axios.post(
        url,
        {
          userNo: users.userNo,
          userNm: userNm,
          userDpt: userDpt,
          userPhone: userPhone,
          userEmail : userEmail,
          role : userRole,
          useStatus : useStatus
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
          alert("업데이트 할 유저를 찾을 수 없습니다.");
          return;
        }
        setUpdateCountManageUser();
      } else if (response.data.status === "NOT_FOUND") {
        alert("인증되지 않은 접근입니다.");
        localStorage.removeItem("jwtToken");
        history.push("/login");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("서버와 연결이 되지 않습니다.");
    }
  };


    return(
        <div>
            <h3>사용자 계정 정보</h3>
            <hr/>
            <table className="table table-bordered">
                <tbody>
                    {/* <tr>
                    <LeftTd>구분</LeftTd>
                        <RightTd><select 
                                    onChange={(e)=>{setQaGroup(e.target.value)}}
                                    value={qaGroup} defaultValue={qaGroup}>
                                <option value="템플릿 관련" selected>템플릿 관련</option>
                                <option value="시스템 문의" selected>시스템 문의</option>
                                <option value="회원 정보" selected>회원 정보</option>
                                <option value="기타" selected>기타</option>
                            </select>
                        </RightTd>
                    </tr> */}
                    <tr>
                        <LeftTd>ID</LeftTd>
                        <RightTd><input
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    value={userId}>
                                </input>
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>이름</LeftTd>
                        <RightTd><input
                                    type="text"
                                    className="form-control"
                                    onChange={(e)=>{setUserNm(e.target.value)}}
                                    value={userNm}>
                                </input>
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>소속부서</LeftTd>
                        <RightTd><input
                                    type="text"
                                    className="form-control"
                                    onChange={(e)=>{setUserDpt(e.target.value)}}
                                    value={userDpt}
                                    >
                                </input>
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>PHONE</LeftTd>
                        <RightTd><input
                                    type="text"
                                    className="form-control"
                                    onChange={(e)=>{setUserPhone(e.target.value)}}
                                    value={userPhone}
                                    >
                                </input>
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>EMAIL</LeftTd>
                        <RightTd><input
                                    type="text"
                                    className="form-control"
                                    onChange={(e)=>{setUserEmail(e.target.value)}}
                                    value={userEmail}
                                    >
                                </input>
                        </RightTd>
                    </tr>
                    <tr>
                    <LeftTd>계정권한</LeftTd>
                        <RightTd><select 
                                    onChange={(e)=>{setUserRole(e.target.value)}}
                                    value={userRole}>
                                <option value='USER' selected>USER</option>
                                <option value='ADMIN' selected>ADMIN</option>
                            </select>
                        </RightTd>
                    </tr>
                    <tr>
                    <LeftTd>계정상태</LeftTd>
                        <RightTd><select 
                                    onChange={(e)=>{setUseStatus(e.target.value)}}
                                    value={useStatus}>
                                <option value='0' selected>활성</option>
                                <option value='1' selected>비활성</option>
                            </select>
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>등록자</LeftTd>
                        <RightTd>{regId}</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>등록 일시</LeftTd>
                        <RightTd>{dateFormat(new Date(regDate))}</RightTd>
                    </tr>
                </tbody>
            </table>
            <hr/>
            <div className="d-flex justify-content-center">
                
                <button className="btn btn-secondary mr-3" onClick={onClose}>닫기</button>
                <button className="btn btn-secondary" onClick={()=>{
                    if(window.confirm('저장하시겠습니까?')) {
                        updateUserInfo();
                        onClose();
                    }
                }}>저장</button>
            </div>
        </div>
    )
}

const LeftTd = styled.td`
    width: 30%;
`;

const RightTd = styled.td`
    width: 70%;
`;