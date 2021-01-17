import React, { createContext, useReducer } from "react";

// Main 초기 상태
const initialState = {
  addImageModalStatus: false,
  editorModalStatus: false,
  modalStatus: false,
  boxes: [],
  boxKeyIndex: 0,
  html: "<strong>Do it</string>",
  currentEditingBoxHandler: null,
  currentBoxesState: null,
  modifiableBoxesState: true,
  convertedImage: "#",
  templateBackground: "backImage",
  tableWidth: 600,
  tableHeight: 1000,
  boxShadow: true,
  popUpMessages: []
};
const globalStateStore = createContext(initialState);
const { Provider } = globalStateStore;

// Main Reducer
const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "ON_EDITOR_MODAL":
        return {
          ...state,
          ...action.value
        };
      case "OFF_EDITOR_MODAL":
        return {
          ...state,
          ...action.value
        };
      case "SYNK_EDTIOR_TO_RESULT":
        return {
          ...state,
          html: action.value.html
        };
      case "ON_OFF_MODAL_BUTTON": {
        return {
          ...state,
          modalStatus: action.value.modalStatus
        };
      }
      case "ON_ADD_IMAGE_MODAL":
        return {
          ...state,
          ...action.value
        };
      case "OFF_ADD_IMAGE_MODAL":
        return {
          ...state,
          ...action.value
        };
      case "CREATE_BOX":
        return {
          ...state,
          ...action.value
        };
      case "UPDATE_BOXES":
        return {
          ...state,
          boxes: action.value.boxes
        };
      case "ON_OFF_ALL_MODIFIABLE_BOXES_STATE":
        return {
          ...state,
          modifiableBoxesState: action.value.modifiableBoxesState
        };
      case "CONVERTING_IMAGE":
        return {
          ...state,
          convertedImage: action.value.convertedImage,
          modifiableBoxesState: action.value.modifiableBoxesState,
          templateBackground: action.value.templateBackground,
          tableHeight: action.value.tableHeight
        };
      case "CONVERT_BOX_SHADOW":
        return {
          ...state,
          boxShadow: action.value.boxShadow
        };
      case "ADD_POPUP_MESSAGE": {
        const newPopUpMessages = [].concat(state.popUpMessages);
        newPopUpMessages.push(action.value.popUpMessage);
        return {
          ...state,
          popUpMessages: newPopUpMessages
        };
      }
      case "DELETE_POPOUP_MESSAGE": {
        let newPopUpMessages = [].concat(state.popUpMessages);
        const findIndex = newPopUpMessages.indexOf(
          `${action.value.popUpMessage}`
        );
        console.log(action.value.popUpMessage, "-");
        console.log(newPopUpMessages[0] === "" + action.value.popUpMessage);
        if (findIndex !== -1) {
          if (findIndex === 1) newPopUpMessages = [];
          else if (findIndex === newPopUpMessages.length - 1)
            newPopUpMessages.pop();
          else {
            newPopUpMessages = newPopUpMessages
              .slice(0, findIndex)
              .concat(
                newPopUpMessages.slice(findIndex + 1, newPopUpMessages.length)
              );
          }
          return {
            ...state,
            popUpMessages: newPopUpMessages
          };
        }
        return { ...state };
      }
      case "TABLE_RESIZE" :
      return {
        ...state,
        tableWidth: action.value.tableWidth,
        tableHeight: action.value.tableHeight
      }
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { globalStateStore, StateProvider };
