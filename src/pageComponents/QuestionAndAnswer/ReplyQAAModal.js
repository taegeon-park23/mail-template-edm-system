import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import styled from "styled-components";
import dateFormat from "../../dateFormat";

export default function ReplyQAAModal({id, onClose, onChangeId, setUpdateCountQa, history}) {



    // state
    const [qaNo, setQaNo] = useState(id);
    const [qaTitle, setQaTitle] = useState("");
    const [qaContent, setQaContent] = useState("");
    const [qaAttach, setQaAttach] = useState("");
    const [qaGroup, setQaGroup] = useState("");
    const [qaReplyContent, setQaReplyContent] = useState("");
    const [useStatus, setUseStatus] = useState(0);
    const [regDate, setRegDate] = useState("");
    const [regId, setRegId] = useState(0);
    const [editDate, setEditDate] = useState("");
    const [editor, setEditor] = useState(0);
    const [qaDate, setQaDate] = useState("");
    const [qaRegNm, setQaRegNm] = useState("");

    const [updateCount, setUpdateCount] = useState(0);


    useEffect(()=>{
        if(qaNo!==0) selectOneQa();

    }, [updateCount]);


    const selectOneQa = async () => {
        const url = "/user/qa/selectOneQa";
        try {
          const response =
          await axios.post(url, 
              {"qaNo": qaNo}, {headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('jwtToken')
              }});
    
            if(response.data.status === "OK") {
                if(response.data.data === null) {
                  alert("조회된 QnA가 없습니다."); return;
                }
                setQaNo(response.data.data.qaNo)
                setQaTitle(response.data.data.qaTitle);
                setQaContent(response.data.data.qaContent);
                setQaAttach(response.data.data.qaAttach);
                setQaGroup(response.data.data.qaGroup)
                setQaReplyContent(response.data.data.qaReplyContent)
                setQaGroup(response.data.data.qaGroup)
                const regDate = response.data.data.regDate;
                const editDate = response.data.data.editDate;
                setQaDate(!editDate ? regDate : editDate);
                setQaRegNm(response.data.data.qaUserNm);
            } else if(response.data.status === "NOT_FOUND"){
                alert("인증되지 않은 접근입니다.");
                localStorage.removeItem('jwtToken');
                history.push('/login');
            }
          } catch(err) {
            alert("서버와의 접근이 불안정합니다.");
          }
      }

      const updateQaReply = async () => {
        const url = "/admin/qa/updateQaReply";
        try {
          const response = await axios.post(
            url,
            { qaNo : qaNo, qaReplyContent : qaReplyContent },
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
            setUpdateCount(updateCount + 1);
            setUpdateCountQa();
            onClose();
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




    return(
        <div>
            <h3>Q&A 상세</h3>
            <hr/>
            <table className="table table-bordered">
                <tbody>
                    <tr>
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
                    </tr>
                    <tr>
                        <LeftTd>제목</LeftTd>
                        <RightTd><input
                                    type="text"
                                    className="form-control"
                                    value={qaTitle}
                                    readOnly>
                                </input>
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>내용</LeftTd>
                        <RightTd><textarea
                                    type="text"
                                    className="form-control"
                                    value={qaContent}
                                    readOnly>
                                </textarea>
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>답변</LeftTd>
                        <RightTd><textarea
                                    type="text"
                                    className="form-control"
                                    onChange={(e)=>{setQaReplyContent(e.target.value)}}
                                    value={qaReplyContent}>
                                </textarea>
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>등록자</LeftTd>
                        <RightTd>{qaRegNm}</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>등록 일시</LeftTd>
                        <RightTd>{dateFormat(new Date(qaDate))}</RightTd>
                    </tr>
                </tbody>
            </table>
            <hr/>
            <div className="d-flex justify-content-center">
                <button className="btn btn-secondary mr-3" 
                    onClick={onClose}>닫기
                </button>
                <button className="btn btn-secondary" 
                    onClick={()=>{
                        //빈칸이나 공백을 둘 수 없다.
                        if ( qaReplyContent && qaReplyContent.length > 0 ? qaReplyContent[0] !== " " : false ) {
                            updateQaReply();
                        } else {
                            alert("저장하려면 답변을 입력해주세요!");
                        }
                        }}>저장
                </button>
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