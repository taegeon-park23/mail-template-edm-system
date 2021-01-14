import React from 'react';
import styled from "styled-components";
export default function QAADetailModal({id, onClose, onChangeId}) {
    return(
        <div>
            <h3>Q&A 상세</h3>
            <hr/>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <LeftTd>구분</LeftTd>
                        <RightTd><select>
                                <option value="" selected>시스템문의</option>
                            </select></RightTd>
                    </tr>
                    <tr>
                        <LeftTd>제목</LeftTd>
                        <RightTd>질문입니다.</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>내용</LeftTd>
                        <RightTd>질문입니다.</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>답변</LeftTd>
                        <RightTd>↳ 질문입니다.<br></br>답변입니다</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>등록자</LeftTd>
                        <RightTd>홍길동</RightTd>
                    </tr>
                    <tr>
                        <LeftTd>등록 일시</LeftTd>
                        <RightTd>2020-10-10 11:11:11</RightTd>
                    </tr>
                </tbody>
            </table>
            <hr/>
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