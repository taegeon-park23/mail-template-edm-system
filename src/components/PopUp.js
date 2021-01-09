import React, { useState, useContext, useCallback, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { globalStateStore } from "../stores/globalStateStore";
const PopUp = ({}) => {
  const globalState = useContext(globalStateStore);
  const { state, dispatch } = globalState;
  const popUpMessages = state.popUpMessages;
  const deleteEffectCallback = useCallback((message) => {
    setTimeout(() => {
      dispatch({
        type: "DELETE_POPOUP_MESSAGE",
        value: { popUpMessages: message }
      });
    }, 1000);
  });

  return (
    <>
      {popUpMessages.length > 0 && (
        <PopUpDivWrapper>
          {popUpMessages.map((message) => (
            <PopUpBox message={message} />
          ))}
        </PopUpDivWrapper>
      )}
    </>
  );
};
const PopUpBox = ({ message }) => {
  const globalState = useContext(globalStateStore);
  const { dispatch } = globalState;
  const deleteEffectCallback = useCallback((message) => {
    setTimeout(() => {
      dispatch({
        type: "DELETE_POPOUP_MESSAGE",
        value: { popUpMessage: message }
      });
    }, 1000);
  });
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (active === false) {
      setActive(true);
      deleteEffectCallback(message);
    }
  }, [active]);
  return (
    <PopUpDiv active={active}>
      <TopBar>
        <TopBarCloseButton
          className="btn btn-info"
          onClick={() => {
            setActive(true);
            deleteEffectCallback(message);
          }}
        >
          x
        </TopBarCloseButton>
      </TopBar>
      <MessageBox>
        <p>{message}</p>
      </MessageBox>
    </PopUpDiv>
  );
};
const boxFadeOut = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
`;

const PopUpDivWrapper = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
`;
const PopUpDiv = styled.div`
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffc107;
  box-shadow: 1px 1px 3px gray, -1px -1px 3px #ecf0f1;
  width: 200px;
  min-height: 100px;
  padding: 5px;
  margin: 10px;
  ${(props) => {
    if (props.active) {
      return css`
        animation: ${boxFadeOut} 1s linear;
      `;
    }
  }}
`;
const TopBar = styled.div`
  width: 100%;
`;
const TopBarCloseButton = styled.button`
  margin-left: auto;
  margin-top: 3px;
  margin-right: 3px;
  display: flex;
  box-shadow: 1px 1px 3px gray, -1px -1px 3px #ecf0f1;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 2px;
  font-size: 15px;
  font-weight: 800px;
  color: white;
`;
const MessageBox = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  text-align: center;
  font-family: "Spoqa Han Sans", "Sans-serif";
  font-weight: 700;
`;
export default PopUp;
