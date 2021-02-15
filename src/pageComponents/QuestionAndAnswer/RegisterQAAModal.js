import axios from 'axios';
import React, {useEffect, useState, useContext} from 'react'
import styled from "styled-components";
import { globalStateStore } from "../../stores/globalStateStore";


export default function RegisterQAAModal({id, onClose, setUpdateCountQa, history}) {


    const globalState = useContext(globalStateStore);
    const { state } = globalState;
    const [updateCount, setUpdateCount] = useState(0);

    const [qaNo, setQaNo] = useState();
    const [qaTitle, setQaTitle] = useState();
    const [qaContent, setQaContent] = useState();
    const [qaAttach, setQaAttach] = useState();
    const [qaGroup, setQaGroup] = useState('템플릿 관련');
    const [qaReplyContent, setQaReplyContent] = useState();
    const [useStatus, setUseStatus] = useState();
    const [regDate, setRegDate] = useState();
    const [regId, setRegId] = useState();
    const [editDate, setEditDate] = useState();
    const [editor, setEditor] = useState();


    useEffect(()=>{

    }, [updateCount])



    const saveQaInsert = async (e) => {
        const url = "/user/qa/save";

        try {
            const response = await axios.post(url, {
                "qaNo" : qaNo,
                "qaTitle" : qaTitle,
                "qaContent" : qaContent,
                "qaAttach" : 0,
                "qaGroup" : qaGroup,
                "qaReplyContent" : qaReplyContent,
                "useStatus" : 0,
                "regDate" : null,
                "regId" : null,
                "editDate" : null,
                "editor" : null
                
            }, {headers : {
                "Content-Type" : "application/json",
                "x-auth-token" : localStorage.getItem('jwtToken')
            }}).catch(function(error) {
        
                if(error.response.status===403) {
                  localStorage.removeItem("jwtToken");
                  history.push("/login");
                }
              });

            if (response.data.status === "OK") {
                alert(response.data.message);
                setUpdateCount(updateCount+1);
                setUpdateCountQa();
                onClose();
                
            } else if(response.data.status === "NOT_FOUND") {
                localStorage.removeItem('jwtToken');
                history.push("/login");
                alert(response.message);

            }

        } catch(err) {
            alert("서버와의 연결이 불안정합니다.");

        }
    }

    




    return(
        <div>
            <h3>Q&A 등록</h3>
            <hr/>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <LeftTd>구분</LeftTd>
                        <RightTd><select 
                                    onChange={(e)=>{setQaGroup(e.target.value)}}
                                    value={qaGroup} defaultValue="1">
                                <option value="템플릿 관련" selected>템플릿 관련</option>
                                <option value="시스템 문의" selected>시스템 문의</option>
                                <option value="회원 정보" selected>회원 정보</option>
                                <option value="기타" selected>기타</option>
                            </select>
                            
                            </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>제목</LeftTd>
                        <RightTd>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e)=>{setQaTitle(e.target.value)}}
                                value={qaTitle}
                            />
                        </RightTd>
                    </tr>
                    <tr>
                        <LeftTd>내용</LeftTd>
                        <RightTd>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e)=>{setQaContent(e.target.value)}}
                                value={qaContent}
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
                            saveQaInsert();
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