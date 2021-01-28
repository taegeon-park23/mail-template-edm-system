import axios from 'axios';
import React, {useEffect, useState, useContext} from 'react'
import styled from "styled-components";
import { globalStateStore } from "../../stores/globalStateStore";

export default function QAADetailModal({id, onClose, onChangeId}) {

    const globalState = useContext(globalStateStore);
    const { state } = globalState;
    const [updateCount, setUpdateCount] = useState(0);

    const [qaNo, setQaNo] = useState();
    const [qaTitle, setQaTitle] = useState();
    const [qaContent, setQaContent] = useState();
    const [qaAttach, setQaAttach] = useState();
    const [qaGroup, setQaGroup] = useState('1');
    const [qaReplyContent, setQaReplyContent] = useState();
    const [useStatus, setUseStatus] = useState();
    const [regDate, setRegDate] = useState();
    const [regId, setRegId] = useState();
    const [editDate, setEditDate] = useState();
    const [editor, setEditor] = useState();


    useEffect(()=>{
    }, [updateCount])



    const saveQaInsert = async (e) => {
        const url = "http://localhost:8080/qa/save";

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
                "x-auth-token" : state.jwtToken
            }});

            if (response.data.status === "OK") {
                alert(response.data.message);
                setUpdateCount(updateCount+1);
                
                
            } else {
                alert(response.message);

            }

        } catch(err) {
            console.log(err);
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
                                <option value="1" selected>시스템문의1</option>
                                <option value="2" selected>시스템문의2</option>
                                <option value="3" selected>시스템문의3</option>
                                <option value="4" selected>시스템문의4</option>
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