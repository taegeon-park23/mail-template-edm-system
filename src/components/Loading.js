import React from 'react';
import styled from "styled-components";

const Loading = ({}) => {
    return(
        <>
            <WrapperDiv>{" "}</WrapperDiv>
            <LoadingDiv>
                <SpinOuterDiv>
                    <SpinInnerDiv>
                        
                    </SpinInnerDiv>
                </SpinOuterDiv>
            </LoadingDiv>
        </>
    )
}

const WrapperDiv = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    filter: grayscale(70%);
`;

const LoadingDiv = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
`;

const SpinOuterDiv = styled.div`
    width: 200px;
    height: 200px;
    background: linear-gradient(90deg, #fb3 33.3%, #58a 0, #58a 66.6%, #5ba 0);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;

    @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
    @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
    @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
    opacity: 0.8;
`;

const SpinInnerDiv = styled.div`
    width: 150px;
    height: 150px;
    background: white;
    border-radius: 100%;
    opacity: 0.8;
`;

export default Loading;