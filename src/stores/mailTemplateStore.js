import React, { createContext, useReducer } from "react";

// Main 초기 상태
const initialState = {
  // intialContents
  saveContentsStatus: false,
  contents: {
    header: {
      tdClasses: [
        {
          align: "center",
          width: "30",
          height: "200",
          content: `<b>header</b>`
        }
      ]
    },
    body: {
      contentRowTables: [
        {
          tdClasses: [
            {
              align: "center",
              width: "30",
              height: "200",
              content: `<b>td1</b>`
            },
            {
              align: "center",
              width: "30",
              height: "200",
              content: `<b>td2</b>`
            }
          ]
        }
      ]
    },
    footer: {
      tdClasses: [
        {
          align: "center",
          width: "30",
          height: "200",
          content: `<b>footer</b>`
        }
      ]
    }
  }
};
const mailTemplateStore = createContext(initialState);
const { Provider } = mailTemplateStore;

// Main Reducer
const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SAVE_ONOFF_CONTENTS":
        return {
          ...state,
          saveContentsStatus: action.value.saveContentsStatus
        };
      case "UPDATE_CONTENTS":
        return {
          ...state,
          contents: action.value.contents
        };
      default:
        throw new console.log(`Unhandled action type: ${action.type}`);
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { mailTemplateStore, StateProvider };