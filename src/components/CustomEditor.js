import React from "react";
import styled from "styled-components";

import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor.js";
import InlineEditor from "@ckeditor/ckeditor5-editor-inline/src/inlineeditor.js";

import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment.js";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote.js";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat.js";
import Autosave from "@ckeditor/ckeditor5-autosave/src/autosave.js";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder.js";
import CKFinderUploadAdapter from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter.js";
import ExportToPDF from "@ckeditor/ckeditor5-export-pdf/src/exportpdf.js";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor.js";
import FontFamily from "@ckeditor/ckeditor5-font/src/fontfamily.js";
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize.js";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js";
import Image from "@ckeditor/ckeditor5-image/src/image.js";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption.js";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize.js";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle.js";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar.js";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload.js";
import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert.js";
import Indent from "@ckeditor/ckeditor5-indent/src/indent.js";
import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed.js";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import SpecialCharacters from "@ckeditor/ckeditor5-special-characters/src/specialcharacters.js";
import SpecialCharactersEssentials from "@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough.js";
import Table from "@ckeditor/ckeditor5-table/src/table.js";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar.js";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation.js";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline.js";

const installedPlugins = [
  Alignment,
  Autoformat,
  Autosave,
  BlockQuote,
  Bold,
  CKFinder,
  CKFinderUploadAdapter,
  Essentials,
  ExportToPDF,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageInsert,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  Table,
  TableToolbar,
  TextTransformation,
  Underline,
];

// import './index.css'
export default function CustomEditor({classic, data,onChangeHandler, onBlurHandler, onFocusHnadler}) {
  const editor = classic === true ? ClassicEditor :InlineEditor;
  return (
    <CustomEditorWrapperDiv>
      <CKEditor
        editor={editor}
        config={{
          plugins: [...installedPlugins],
          toolbar: [
            "heading",
            "fontSize",
            "fontFamily",
            "fontColor",
            "alignment",
            "|",
            "bold",
            "italic",
            "strikethrough",
            "underline",
            "specialCharacters",
            "horizontalLine",
            "|",
            "indent",
            "outdent",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "link",
            "CKFinder",
            "imageInsert",
            "insertTable",
            "|",
            "undo",
            "redo"
          ]
        }}
        data={data}
        onChange={(event, editor)=>{onChangeHandler(event, editor)}}
        onBlur={(event, editor)=>{onBlurHandler(event, editor)}}
        onFocus={(event, editor)=>{onFocusHnadler(event, editor)}}
      />
    </CustomEditorWrapperDiv>
  );
}

const CustomEditorWrapperDiv = styled.div`
  .ck-editor__editable_inline {
    padding: 0px;
    margin: 0px;
  }

  span.text-huge {
    font-size: 48px;
  }
  span.text-big {
    font-size: 36px;
  }
  span.text-default {
    font-size: 24px;
  }
  span.text-small {
    font-size: 12px;
  }
  span.text-tiny {
    font-size: 6px;
  }

  p, div { margin: 0px; padding:0px;}
  .ck-horizontal-line {
    max-height: 4px;
  }
  hr {
    margin :0px;
    /* height :16px; */
    /* border-color :#dedede; */
    border-width :4px;
  }
  .ck-widget_selected {
   height: 0px;
    max-height: 0px;
  }

  ul, ol, li, figure {
    margin: 0px;
  }
  figure {
    padding: 0px; margin-top: 0px; margin-bottom:0px;
  }

  .ck .ck-widget__selection-handle {
    display: none;
  }

  .ck-content .table {
    margin: 0px;
  }
`;