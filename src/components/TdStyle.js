import React from "react";
import styled from "styled-components";
import { ReactComponent as TdStyle1 } from "../assets/icons/tdStyle1.svg";
import { ReactComponent as TdStyle2 } from "../assets/icons/tdStyle2.svg";
import { ReactComponent as TdStyle3 } from "../assets/icons/tdStyle3.svg";

export default function TdStyle({ addContentRow, onClose }) {
  const onClickTdStyleWrapperHandler = (number) => {
    addContentRow(number);
    onClose();
  };

  return (
    <TdStyleDiv>
      <p className=" mr-auto">
        <h3>BOX STYLE</h3>
        <sup>{}</sup>
      </p>
      <p
        className="text-center d-flex justify-content-center rounded-pill"
        style={{ height: "30px" }}
      >
        <h5>원하시는 박스스타일을 선택하세요</h5>
      </p>
      <TdStyleWrapper
        onClick={() => {
          onClickTdStyleWrapperHandler(3);
        }}
      >
        <TdStyle1
          style={{
            background: "#5a5c69",
            borderRadius: "10px",
            color: "white",
          }}
        />
      </TdStyleWrapper>
      <TdStyleWrapper
        onClick={() => {
          onClickTdStyleWrapperHandler(2);
        }}
      >
        <TdStyle2
          style={{
            background: "#5a5c69",
            borderRadius: "10px",
            color: "white",
            marginTop: "10px",
          }}
        />
      </TdStyleWrapper>
      <TdStyleWrapper
        onClick={() => {
          onClickTdStyleWrapperHandler(1);
        }}
      >
        <TdStyle3
          style={{
            background: "#5a5c69",
            borderRadius: "10px",
            color: "white",
            marginTop: "10px",
          }}
        />
      </TdStyleWrapper>
    </TdStyleDiv>
  );
}

const TdStyleDiv = styled.div`
  width: 100%auto;
  height: 100%auto;
  border-radius: 10;
`;

const TdStyleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    filter: grayscale(0.8);
  }
`;
