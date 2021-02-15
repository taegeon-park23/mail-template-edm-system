import React, { useContext, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import BoxEditor from "../../components/CustomEditor";
import Modal from "../../components/Modal";
import ResizableDiv from "./TemplateBackground/ResizableDiv";
import CreateBoxModal from "./TemplateBackground/CreateBoxModal";
import AddImageModal from "../../components/AddImageModal";
import { globalStateStore } from "../../stores/globalStateStore";

export default function TemplateBackground() {
  const TemplateFormTableRef = useRef(null);
  const globalState = useContext(globalStateStore);
  const { state, dispatch } = globalState;

  useEffect(() => {
    //[마우스 오른쪽 클릭 이벤트 수행 방지] componentDidMount
    if (TemplateFormTableRef.current !== null) {
      const dom = ReactDOM.findDOMNode(TemplateFormTableRef.current);
      dom.addEventListener(
        "contextmenu",
        function (evt) {
          evt.preventDefault();
        },
        false
      );
    }

    //[현재 박스에 대한 수정권한을 얻어왔을 때 수행, 해당 div update]
    if (state.currentEditingBoxHandler && state.editorModalStatus === true)
      state.currentEditingBoxHandler({
        ...state.currentBoxesState,
        content: state.html,
      });
  });

  // Editor Modal 열고 닫는 핸들러
  const onClickEditorModalButton = (updateHtmlHandler, boxesState) => {
    // Editor Modal이 열려있지 않을 때, Modal을 열면서 box에 대한
    // setState 함수와, 현재 박스의 state를 얻어와
    // 현재 state를 갱신

    if (state.editorModalStatus === false) {
      if (updateHtmlHandler) {
        dispatch({
          type: "ON_EDITOR_MODAL",
          value: {
            editorModalStatus: true,
            currentEditingBoxHandler: updateHtmlHandler,
            currentBoxesState: boxesState,
            html: boxesState.content,
          },
        });
      }
    } else {
      // 박스를 닫을 때
      dispatch({
        type: "OFF_EDITOR_MODAL",
        value: {
          editorModalStatus: false,
          currentEditingBoxHandler: null,
          currentBoxesState: null,
        },
      });
    }
  };

  // 현재 Editor의 html와, 지금 state의 html을 동기화 해주는 함수
  const synkEditorToResult = (result) => {
    dispatch({ type: "SYNK_EDTIOR_TO_RESULT", value: { html: result } });
  };

  // Box 생성 모달 on&off
  const onClickModalButton = (e) => {
    dispatch({
      type: "ON_OFF_MODAL_BUTTON",
      value: { modalStatus: !state.modalStatus },
    });
  };

  
  // Box에 image 추가 모달 on&off
  const onClickAddImageModalOn = (updateHtmlHandler, boxesState) => {
    if (state.addImageModalStatus === false) {
      if (updateHtmlHandler) {
        dispatch({
          type: "ON_ADD_IMAGE_MODAL",
          value: {
            addImageModalStatus: true,
            currentEditingBoxHandler: updateHtmlHandler,
            currentBoxesState: boxesState,
          },
        });
      }
    } else {
      // 박스를 닫을 때
      state.currentEditingBoxHandler({
        ...state.currentBoxesState,
        content: state.html,
      });
      dispatch({
        type: "OFF_ADD_IMAGE_MODAL",
        value: {
          addImageModalStatus: false,
          currentEditingBoxHandler: null,
          currentBoxesState: null,
        },
      });
    }
  };

  // box 생성 함수
  const createBox = (width, height) => {
    const newBoxes = [].concat(state.boxes);
    let boxId = `EditorId${state.boxKeyIndex}`;
    newBoxes.push(
      <ResizableDiv
        key={boxId}
        id={boxId}
        currentBoxes={state.boxes}
        parentWidth={600}
        parentHeight={state.tableHeight}
        width={parseInt(width, 0)}
        height={parseInt(height, 0)}
        editBox={onClickEditorModalButton}
        deleteBox={deleteBox}
        orderChangeBox={orderChangeBox}
        addImageBox={onClickAddImageModalOn}
        children={"<p>🎫</p>"}
      />
    );

    dispatch({
      type: "CREATE_BOX",
      value: {
        boxes: newBoxes,
        boxKeyIndex: state.boxKeyIndex + 1,
        modalStatus: false,
      },
    });
  };

  // 박스 제거 함수
  const deleteBox = (key, currentBoxes) => {
    const boxKeys = currentBoxes.map((box) => box.key);
    let deleteBoxKeyIndex = boxKeys.indexOf(key);
    if (deleteBoxKeyIndex !== -1 && boxKeys.length === 1)
      dispatch({ type: "UPDATE_BOXES", value: { boxes: [] } });
    else {
      const newBoxes = []
        .concat(currentBoxes)
        .slice(0, deleteBoxKeyIndex)
        .concat(
          currentBoxes.slice(deleteBoxKeyIndex + 1, currentBoxes.length + 1)
        );
      dispatch({ type: "UPDATE_BOXES", value: { boxes: newBoxes } });
    }
  };

  // 박스 순서 전환
  const orderChangeBox = (key, method, currentBoxes) => {
    // method : 'forward', 'back'
    const boxKeys = currentBoxes.map((box) => box.key);
    let boxKeyIndex = boxKeys.indexOf(key);
    const newBoxes = [].concat(currentBoxes);
    const tempBox = newBoxes[boxKeyIndex];
    if (boxKeyIndex !== -1) {
      switch (method) {
        case "forward": {
          if (boxKeyIndex !== boxKeys.length - 1 && newBoxes.length > 1) {
            newBoxes[boxKeyIndex] = newBoxes[boxKeyIndex + 1];
            newBoxes[boxKeyIndex + 1] = tempBox;
            dispatch({ type: "UPDATE_BOXES", value: { boxes: newBoxes } });
          }
          return;
        }
        case "back": {
          if (boxKeyIndex !== 0 && newBoxes.length > 1) {
            newBoxes[boxKeyIndex] = newBoxes[boxKeyIndex - 1];
            newBoxes[boxKeyIndex - 1] = tempBox;
            dispatch({ type: "UPDATE_BOXES", value: { boxes: newBoxes } });
          }
          return;
        }
        default:
          return;
      }
    }
  };

  return (
    <div id="TemplateBackground" className="container-fluid">
      <p
        className="text-center d-flex justify-content-center rounded-pill"
        style={{ height: "30px" }}
      >
        <h5>템플릿의 배경화면을 꾸미세요</h5>
      </p>
      <h6 className="d-flex justify-content-center">
        <strong className="text-primary">
          메일 시스템에 따라 배경화면이 보이지 않을 수 있습니다.
        </strong>
      </h6>
      {/* 박스 생성 모달 버튼 */}
      <MenuDiv className="shadow-sm p-3 mb-5 bg-white rounded">
        <ModalButton
          className="btn btn-outline-dark"
          onClick={onClickModalButton}
        >
          Modal
        </ModalButton>
      </MenuDiv>
      {/* 박스 생성 모달 */}
      {state.modalStatus === true ? (
        <Modal
          visible={state.modalStatus}
          onClose={onClickModalButton}
          children={
            <CreateBoxModal
              maxWidth={600}
              maxHeight={1000}
              createBox={createBox}
            />
          }
        />
      ) : null}

      {/* 박스 이미지 추가 모달 */}
      {state.addImageModalStatus === true ? (
        <Modal
          visible={state.addImageModalStatus}
          onClose={onClickAddImageModalOn}
          children={<AddImageModal synkEditorToResult={synkEditorToResult} />}
        />
      ) : null}

      {/* 박스 수정 모달 */}
      {state.editorModalStatus === true ? (
        <Modal
          visible={state.editorModalStatus}
          onClose={onClickEditorModalButton}
          children={
            <BoxEditor
              classic={true}
              onChangeHandler={(event, editor)=>{synkEditorToResult(editor.getData())}}
              onBlurHandler={()=>{}}
              onFocusHnadler={()=>{}}
              data={state.html}
            />
          }
        />
      ) : null}

      <TemplateFormWrapper>
        {/* [background div] */}
        <BackMailDiv id="backMailDiv"
          width={600}
          height={state.tableHeight}
          ref={TemplateFormTableRef}
          image={state.convertedImage}
        ></BackMailDiv>

        {/* [background Image Template div] */}
        <TemplateForm id="TemplateForm">
          <TemplateFormTable
            id="templateFomrTable"
            width={600}
            height={state.tableHeight}
            ref={TemplateFormTableRef}
          >
            {state.boxes}
          </TemplateFormTable>
        </TemplateForm>
      </TemplateFormWrapper>
    </div>
  );
}
const MenuDiv = styled.div`
  margin-bottom: 40px;
  padding: 5px;
  font-size: 1em;
  width: 100%;
  display: flex;
  justify-content: center;

  button {
    margin-right: 5px;
  }
`;

const TemplateFormWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const TemplateForm = styled.div`
  /* border: 1px solid black; */
`;
const ModalButton = styled.button``;
const BackMailDiv = styled.div`
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: ${(props) => `no-repeat url("${props.image}")`};
`;
const TemplateFormTable = styled.div`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: none;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.15);
  overflow-x: hidden;
  overflow-y: hidden;
`;
