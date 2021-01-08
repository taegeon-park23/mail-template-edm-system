import React, { useState } from "react";
//image

//import Editor
import {
  EditorState,
  // convertFromRaw,
  convertToRaw,
  ContentState
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CustomEditor = ({ synkEditorToResult, childrenHtml }) => {
  const html =
    `${childrenHtml}` || "<p>Hey this <strong>editor</strong> rocks 😀</p>";
  const contentBlock = htmlToDraft(html);
  let initialEditorState = {};
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const editorState = EditorState.createWithContent(contentState);
    initialEditorState = editorState;
  }

  const [editorState, setEditorState] = useState(initialEditorState);
  const [resultHtml, setResultHtml] = useState(<div>first</div>);
  const onEditorStateChange = (editorState) => {
    if (editorState === undefined || null) return;
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // console.log(editorState.getCurrentContent().getPlainText());
    try {
      setEditorState(editorState);
    } catch (err) {
      // console.log(err);
    }
    synkEditorToResult(html);
    // setResultHtml(html);
  };

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassNameGood"
      wrapperClassName="wrapperClassNameGood"
      editorClassName="editorClassNameGood"
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "fontSize",
          "fontFamily",
          "list",
          "textAlign",
          "colorPicker",
          "link",
          "embedded",
          "emoji",
          "image",
          "history"
        ],
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true }
      }}
    />
  );
};
export default CustomEditor;
// .replace(/(<\/?)img((?:\s+.*?)?>)/g, "")
//         .replace(/(<\/?)figure((?:\s+.*?)?>)/g, "");
