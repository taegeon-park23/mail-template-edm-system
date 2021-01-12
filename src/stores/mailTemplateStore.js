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
            width: "600",
            height: "10",
            borderRadius: "0",
            content: `<p></p>`
          }
        ]
      },
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "200",
            borderRadius: "0",
            content: `<p></p>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "580",
            height: "200",
            borderRadius: "0",
            content: `<b>header</b>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "200",
            borderRadius: "0",
            content: `<p></p>`
          }
        ]
      },
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: "600",
            height: "10",
            borderRadius: "0",
            content: `<p></p>`
          }
        ]
      },
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "200",
            borderRadius: "0",
            content: `<p></p>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "580",
            height: "200",
            borderRadius: "0",
            content: `<b>content</b>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "200",
            borderRadius: "0",
            content: `<p></p>`
          }
        ]
      },
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: "600",
            height: "10",
            borderRadius: "0",
            content: `<p></p>`
          }
        ]
      },
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "150",
            borderRadius: "0",
            content: `<p></p>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "285",
            height: "150",
            borderRadius: "0",
            content: `<b>content</b>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "150",
            borderRadius: "0",
            content: `<p></p>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "285",
            height: "150",
            borderRadius: "0",
            content: `<b>content</b>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "150",
            borderRadius: "0",
            content: `<p></p>`
          }
        ]
      },
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: "600",
            height: "10",
            borderRadius: "0",
            content: `<p></p>`
          }
        ]
      },
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "100",
            borderRadius: "0",
            content: `<p></p>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "580",
            height: "100",
            borderRadius: "0",
            content: `<b>footer</b>`
          },
          {
            align: "center",
            bgcolor: "",
            width: "10",
            height: "100",
            borderRadius: "0",
            content: `<p></p>`
          }
        ]
      },
      {
        tdClasses: [
          {
            align: "center",
            bgcolor: "",
            width: "600",
            height: "10",
            borderRadius: "0",
            content: `<p></p>`
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
  saveContentsStatus: false
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
          version: action.value.version,
          contents: action.value.contents
        };
      case "UPDATE_BGCOLOR":
        return {
          ...state,
          bgcolor: action.value.bgcolor
        }
      default:
        throw new console.log(`Unhandled action type: ${action.type}`);
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { mailTemplateStore, StateProvider };
