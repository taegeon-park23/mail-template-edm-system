import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import styled from "styled-components";


export default function NotificationDetailModal({id, onClose, onChangeId}) {


    const [noticeNo, setNoticeNo] = useState(id);
    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeContent, setNoticeContent] = useState("");
    const [noticeAttach, setNoticeAttach] = useState("");
    const [useStatus, setUseStatus] = useState(0);
    const [regDate, setRegDate] = useState("");
    const [regId, setRegId] = useState(0);
    const [editDate, setEditDate] = useState("");
    const [editor, setEditor] = useState(0);

    const [updateCount, setUpdateCount] = useState(0);



    
    useEffect(()=>{
        if(noticeNo!==0) selectOneNotice();

    }, [updateCount]);



    const selectOneNotice = async () => {
        console.log("noticeNo: " + noticeNo);
        const url = "/user/notice/selectOneNotice";
        try {
          const response =
          await axios.post(url, 
              {"noticeNo": noticeNo}, {headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('jwtToken')
              }});
    
            if(response.data.status === "OK") {
                if(response.data.data === null) {
                  alert("조회된 공지사항이 없습니다."); return;
                }
                setNoticeNo(response.data.data.noticeNo)
                setNoticeTitle(response.data.data.noticeTitle);
                setNoticeContent(response.data.data.noticeContent);
                setNoticeAttach(response.data.data.noticeAttach);
                
                const regDate = response.data.data.regDate;
                const editDate = response.data.data.editDate;
                setRegDate(!editDate ? regDate : editDate);
                
            } else if(response.data.status === "NOT_FOUND"){
                alert("인증되지 않은 접근입니다.");
                localStorage.removeItem('jwtToken');
            }
          } catch(err) {
            alert("서버와의 접근이 불안정합니다.");
          }
      }





    return(
        <div>
            <h3>공지사항 상세</h3>
            <hr/>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <LeftTd>제목</LeftTd>
                        <RightTd>{noticeTitle}</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>내용</LeftTd>
                        <RightTd>{noticeContent}</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>파일</LeftTd>
                        <RightTd>{noticeAttach}</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>등록 일시</LeftTd>
                        <RightTd>{regDate}</RightTd>
                    </tr>
                </tbody>
            </table>
            <hr/>
            {/* <div className="border boredr-secondary rounded mb-3">
                <div className="mb-1"><strong>이전 글 :</strong> 공지사항입니다.</div>
                <div><strong>다음 글 :</strong> 공지사항입니다.</div>
            </div> */}
            <div className="d-flex justify-content-center">
                <button className="btn btn-secondary" onClick={onClose}>확인</button>
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