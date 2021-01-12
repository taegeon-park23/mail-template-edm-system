import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useContext
} from "react";
import ReactDOM from "react-dom";
import ReactHtmlParser from "react-html-parser";
import ResizableRect from "react-resizable-rotatable-draggable";
import styled from "styled-components";
import { globalStateStore } from "../../../stores/globalStateStore";
export default function ResizableDiv({
  children,
  parentWidth,
  parentHeight,
  width,
  height,
  deleteBox,
  editBox,
  orderChangeBox,
  addImageBox,
  setCanModifiableBox,
  id
}) {
  const globalStateContext = useContext(globalStateStore);
  const globalState = globalStateContext.state;
  const { dispatch } = globalStateContext;

  const modifiableRectInitialState = true;
  const intialState = {
    width: width,
    height: height,
    top: 30,
    left: 30,
    rotateAngle: 0,
    content: children
  };

  const ContentDiv = useRef(null);
  const ResizableRectRef = useRef(null);
  const [state, setState] = useState(intialState);
  const [modifiableRectState, setModifiableRectState] = useState(
    modifiableRectInitialState
  );

  useEffect(() => {
    // console.log(setCanModifiableBox);
    if (!ResizableRectRef.current) return;
    const dom = ReactDOM.findDOMNode(ResizableRectRef.current);
    // if (globalState.modifiableBoxesState === false) {
    //   setModifiableRectState(true);
    //   // return;
    // }
    dom.addEventListener(
      "mousedown",
      (mouseEvent) => {
        if (mouseEvent.which === 3) {
          mouseEvent.preventDefault();
          setModifiableRectState(!modifiableRectState);
        }
      },
      [state]
    );

    if (ContentDiv.current !== null) {
      const childHtmlElements = ContentDiv.current.children;
      const childElements = Array.prototype.slice.call(childHtmlElements);
      if (
        childHtmlElements.length === 3 &&
        childElements[0].innerText === "" &&
        childElements[2].innerText === ""
      ) {
        childElements[0].style.marginBottom = 0;
        childElements[2].style.marginBottom = 0;
        childElements[1].style = `width:${state.width}px; height:${state.height}px; z-index:0;`;
        return;
      }

      let totalHeight = 0;
      let maxWidth = state.width;
      childElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const marginHeight =
          parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);
        const marginWidth =
          parseFloat(styles["marginLeft"]) + parseFloat(styles["marginRight"]);
        const elementHeight = Math.ceil(element.offsetHeight + marginHeight);
        const elementWidth = Math.ceil(element.offsetWidth + marginWidth);

        // console.log(elementWidth, elementHeight);
        maxWidth = maxWidth < elementWidth ? elementWidth : maxWidth;
        totalHeight += elementHeight;

        if (maxWidth !== state.width) {
          if (totalHeight > state.height)
            setState({ ...state, width: maxWidth, height: totalHeight });
          else setState({ ...state, width: maxWidth });
        } else if (maxWidth === state.width) {
          if (totalHeight > state.height)
            setState({ ...state, height: totalHeight });
        }
      });
    }
  });

  const handleResize = (style, isShiftKey, type) => {
    let { top, left, width, height } = style;
    top = Math.round(top);
    left = Math.round(left);
    width = Math.round(width);
    height = Math.round(height);

    width = width > parentWidth ? parentWidth : width;
    setState({
      ...state,
      top,
      left,
      width,
      height
    });
  };

  const handleRotate = (rotateAngle) => {
    setState({ ...state, rotateAngle });
  };

  const horizetalMovebyDrag = (deltaX) => {
    if (
      parentWidth >= state.width + state.left + deltaX &&
      state.left + deltaX >= 0
    )
      return state.left + deltaX;
    else if (state.left + deltaX < 0) return 0;
    else if (parentWidth < state.width + state.left + deltaX) return state.left;

    return 0;
  };

  const handleDrag = (deltaX, deltaY) => {
    // ResizableRectRef.zoomable = false;
    setState({
      ...state,
      left: horizetalMovebyDrag(deltaX),
      top: state.top + deltaY >= 0 ? state.top + deltaY : 0
    });
  };

  const contentStyle = {
    boxSizing: "border-box",
    top: state.top,
    left: state.left,
    width: state.width,
    height: state.height,
    position: "absolute",
    overflow: true,
    transform: `rotate(${state.rotateAngle}deg)`
  };

  return (
    <Fragment>
      <div
        ref={ContentDiv}
        style={contentStyle}
        onMouseDown={(mouseEvent) => {
          if (mouseEvent.button === 2) {
            setModifiableRectState(!modifiableRectState);
          }
        }}
      >
        {ReactHtmlParser(state.content)}
      </div>
      {
        modifiableRectState === true &&
        globalState.modifiableBoxesState === true ? (
          <Fragment>
            <Menus
              parentWidth={parentWidth}
              parentHeight={parentHeight}
              state={state}
            >
              <EditButton
                className="btn btn-success"
                onClick={() => {
                  editBox(setState, state);
                }}
              >
                <span>✏</span>
              </EditButton>
              <EditButton
                className="btn btn-success"
                onClick={() => {
                  addImageBox(setState, state);
                }}
              >
                <span>🖼</span>
              </EditButton>
              <EditButton
                className="btn btn-success"
                onClick={() => {
                  orderChangeBox(id, "forward", globalState.boxes);
                }}
              >
                <span>⤴</span>
              </EditButton>
              <EditButton
                className="btn btn-success"
                onClick={() => {
                  orderChangeBox(id, "back", globalState.boxes);
                }}
              >
                <span>⤵</span>
              </EditButton>

              <EditButton
                className="btn btn-success"
                onClick={() => {
                  deleteBox(id, globalState.boxes);
                }}
              >
                <span>🗑</span>
              </EditButton>
            </Menus>

            <ResizableRect
              ref={ResizableRectRef}
              left={state.left}
              top={state.top}
              width={state.width}
              height={state.height}
              rotateAngle={state.rotateAngle}
              // aspectRatio = {false}
              // minWidth = {10}
              // minHeight = {10}
              zoomable="n, w, s, e, nw, ne, se, sw"
              // rotatable = {true}
              // onRotateStart = {this.handleRotateStart}
              onRotate={handleRotate}
              // onRotateEnd = {handleRotateEnd}
              // onResizeStart = {handleResizeStart}
              onResize={handleResize}
              // onResizeEnd = {handleUp}
              // onDragStart = {handleDragStart}
              onDrag={handleDrag}
              // onDragEnd = {handleDragEnd}
              // ref={ResizableRectRef}
            />
          </Fragment>
        ) : null
        // (
        //   <div
        //     style={contentStyle}
        //     onMouseDown={(mouseEvent) => {
        //       if (mouseEvent.button === 2) {
        //         setModifiableRectState(!modifiableRectState);
        //       }
        //     }}
        //   >
        //     {ReactHtmlParser(state.content)}
        //   </div>
        // )
      }
    </Fragment>
  );
}

const EditButton = styled.button`
  position: relative;
  width: 30px;
  height: 30px;
  padding: 0px;
  font-weight: 800;
  margin: 5px;
`;

const Menus = styled.div`
  position: absolute;
  background: none;
  display: flex;
  flex-direction: ${(props) => {
    if (props.parentWidth - 16 >= props.state.width) return "column";
    if (props.parentHeight > props.state.top + 200) return "row";
  }};
  top: ${(props) => {
    if (props.parentHeight > props.state.top + 200) return props.state.top;
    else return props.state.top - 200;
  }}px;
  left: ${(props) => {
    if (props.parentWidth - 50 > props.state.width + props.state.left)
      return props.state.width + props.state.left;
    else return props.state.left;
  }}px;
  z-index: 100;
  /* width: ${(props) => props.state.width}px; */
  /* height: ${(props) => props.state.height}; */
`;
