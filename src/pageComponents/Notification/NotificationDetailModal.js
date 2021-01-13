import React from 'react';
import styled from "styled-components";
export default function NotificationDetailModal({id, onClose, onChangeId}) {
    return(
        <div>
            <h3>공지사항 상세</h3>
            <hr/>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <LeftTd>제목</LeftTd>
                        <RightTd>공지사항 입니다</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>내용</LeftTd>
                        <RightTd>공지사항을 확인해주세요</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>파일</LeftTd>
                        <RightTd>파일</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>등록 일시</LeftTd>
                        <RightTd>2020-10-10 11:11:11</RightTd>
                    </tr>
                </tbody>
            </table>
            <hr/>
            <div className="border boredr-secondary rounded mb-3">
                <div className="mb-1"><strong>이전 글 :</strong> 공지사항입니다.</div>
                <div><strong>다음 글 :</strong> 공지사항입니다.</div>
            </div>
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