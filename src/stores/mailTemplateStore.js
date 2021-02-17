import React, { createContext, useReducer } from "react";

// Main 초기 상태
const initialContents = {
  body: {
    contentRowTables: [
      //header
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: 100,
            height: 100,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 0,
            content: `<p style="padding:0px; margin:0px"></p>`
          }
        ]
      }
    ]
  }
};

const initialState = {
  // intialContents
  bgcolor: "white",
  version: 0,
  tableWidth: 600,
  contents: initialContents,
  saveContentsStatus: false,
  number: 0
};
const mailTemplateStore = createContext(initialState);
const { Provider } = mailTemplateStore;

// Main Reducer
const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "DOWNLOAD_MAIL_STATE": 
      return {
          ...action.value.mailState,
          version: state.version+1
        }
      case "SAVE_ONOFF_CONTENTS":
        return {
          ...state,
          saveContentsStatus: action.value.saveContentsStatus
        };
      case "UPDATE_CONTENTS":
        return {
          ...state,
          version: action.value.version,
          contents: action.value.contents
        };
      case "UPDATE_BGCOLOR":
        return {
          ...state,
          bgcolor: action.value.bgcolor
        }
      case "UPDATE_NUMBER":
        return {
          ...state,
          number: action.value.number
        }
      default:
        throw new console.log(`Unhandled action type: ${action.type}`);
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { mailTemplateStore, StateProvider };
