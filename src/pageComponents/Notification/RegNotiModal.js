import axios from 'axios';
import React, {useEffect, useState, useContext} from 'react'
import styled from "styled-components";
import { globalStateStore } from "../../stores/globalStateStore";

export default function RegNotiModal({id, onClose, setUpdateCountNotice}) {

    const globalState = useContext(globalStateStore);
    const { state } = globalState;
    const [updateCount, setUpdateCount] = useState(0);

    const [noticeNo, setNoticeNo] = useState(id);
    const [noticeTitle, setNoticeTitle] = useState();
    const [noticeContent, setNoticeContent] = useState();


    useEffect(()=>{

    }, [updateCount])



    const saveNoticeInsert = async (e) => {
        const url = "/admin/notice/save";

        try {
            const response = await axios.post(url, {
                
                "noticeTitle" : noticeTitle,
                "noticeContent" : noticeContent,
             
                
            }, {headers : {
                "Content-Type" : "application/json",
                "x-auth-token" : localStorage.getItem('jwtToken')
            }});

            if (response.data.status === "OK") {
                setUpdateCountNotice();
                
                
            } else if(response.data.status === "NOT_FOUND") {
                localStorage.removeItem('jwtToken');
                alert(response.message);

            }

        } catch(err) {
            console.log(err);
            alert("서버와의 연결이 불안정합니다.");

        }
    }

    




    return(
        <div>
            <h3>공지사항 등록</h3>
            <hr/>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <LeftTd>제목</LeftTd>
                        <RightTd>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e)=>{setNoticeTitle(e.target.value)}}
                                value={noticeTitle}
                            />
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>내용</LeftTd>
                        <RightTd>
                            <textarea
                                type="text"
                                className="form-control"
                                onChange={(e)=>{setNoticeContent(e.target.value)}}
                                value={noticeContent}
                            />
                        </RightTd>
                    </tr>
                </tbody>
            </table>
            <hr/>
            <div className="d-flex justify-content-center">
            <button className="btn btn-secondary mr-3" onClick={onClose}>취소</button>
                <button className="btn btn-secondary" 
                        onClick={()=>{
                            if(window.confirm('등록하시겠습니까?')) {
                                onClose();
                                saveNoticeInsert();
                            }
                            
                        }}
                        
                        >저장</button>
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