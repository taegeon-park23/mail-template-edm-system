import React from 'react';
export default function RegisterBatchAddressbookModal({onClose, onRegister}) {
    return(
        <div>
            <h3>주소록 일괄 등록</h3>
            <hr/>
            <button className="btn btn-dark mb-2">서식 다운로드</button>
            <div className="border border-secondary rounded mb-3">
            <input type="file"/>
            </div>
            <p className="text-primary">❗ 총 00MB 미만의 파일만 업로드 가능 합니다</p>
            <p className="text-primary">❗ 파일명은 영문자, 숫자만 가능하며 최종 [확인] 버튼을 눌러주세요</p>
            
            <div className="d-flex justify-content-center">
                <button onClick={onClose} className="btn btn-outline-secondary mr-3">취소</button>
                <button onClick={onRegister} className="btn btn-secondary">확인</button>
            </div>
        </div>
    )
};