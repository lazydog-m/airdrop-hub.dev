import React, { useState, useEffect, useCallback, useRef } from 'react';
import RichTextEditor from 'reactjs-tiptap-editor';
import { BaseKit } from 'reactjs-tiptap-editor';
import { Blockquote } from 'reactjs-tiptap-editor/blockquote';
import { Bold } from 'reactjs-tiptap-editor/bold';
import { BulletList } from 'reactjs-tiptap-editor/bulletlist';
import { Clear } from 'reactjs-tiptap-editor/clear';
import { CodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { Color } from 'reactjs-tiptap-editor/color';
import { FontSize } from 'reactjs-tiptap-editor/fontsize';
import { Heading } from 'reactjs-tiptap-editor/heading';
import { Highlight } from 'reactjs-tiptap-editor/highlight';
import { History } from 'reactjs-tiptap-editor/history';
import { HorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Iframe } from 'reactjs-tiptap-editor/iframe';
import { Image } from 'reactjs-tiptap-editor/image';
import { Indent } from 'reactjs-tiptap-editor/indent';
import { Italic } from 'reactjs-tiptap-editor/italic';
import { LineHeight } from 'reactjs-tiptap-editor/lineheight';
import { Link } from 'reactjs-tiptap-editor/link';
import { ListItem } from 'reactjs-tiptap-editor/listitem';
import { ColumnActionButton } from 'reactjs-tiptap-editor/multicolumn';
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { Selection } from 'reactjs-tiptap-editor/selection';
import { SlashCommand } from 'reactjs-tiptap-editor/slashcommand';
import { Strike } from 'reactjs-tiptap-editor/strike';
import { Table } from 'reactjs-tiptap-editor/table';
import { TaskList } from 'reactjs-tiptap-editor/tasklist';
import { TextAlign } from 'reactjs-tiptap-editor/textalign';
import { TextBubble } from 'reactjs-tiptap-editor/textbubble';
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { SearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';
import { Emoji } from 'reactjs-tiptap-editor/emoji';
import { ExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import { ExportWord } from 'reactjs-tiptap-editor/exportword';
import { TableOfContents } from 'reactjs-tiptap-editor/tableofcontent';
import { TextDirection } from 'reactjs-tiptap-editor/textdirection';
import { ImageGif } from 'reactjs-tiptap-editor/imagegif';
import 'reactjs-tiptap-editor/style.css';
import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';
import 'react-image-crop/dist/ReactCrop.css';

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
      // placeholder: <span>'Nhập mô tả công việc ...'</span>,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  History,
  Clear,
  // FontSize.configure({
  //   fontSizes: [
  //     // Use default font size list
  //     '20px'
  //   ]
  // }),
  // Heading,
  // Bold,
  // Italic,
  // TextUnderline,
  // Strike,
  // Emoji,
  // Color,
  // Highlight,
  // BulletList,
  // OrderedList,
  // TextAlign.configure({
  //   types: ['heading', 'paragraph'],
  // }),
  // Indent,
  TaskList,
  Link,
  // Image.configure({
  //   upload: (files) => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(URL.createObjectURL(files));
  //       }, 500);
  //     });
  //   },
  // }),
  // ImageGif,
  // Blockquote,
  // HorizontalRule,
  // CodeBlock,
  // ColumnActionButton,
  // Table,
  // TableOfContents,
  // Iframe,
  // ExportPdf,
  // ExportWord,
  // ListItem,
  // Selection,
  // SlashCommand,
  // TextBubble,
  // TextDirection.configure({
  //   types: ['heading', 'paragraph', 'blockquote', 'list_item'],
  //   directions: ['ltr', 'rtl'],
  //   defaultDirection: 'ltr',
  // }),
];


export default function Editor({ value, onChange = () => { }, disabled = false, ...other }) {

  const [content, setContent] = useState(value);
  const editorRef = useRef(null);

  const useEditorOptions = {
    autofocus: false,
    onCreate: ({ editor }) => {
      editorRef.current = editor;
      window.scrollTo(0, 0);
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      onChange?.(html);
    },
    editable: !disabled,
  };

  useEffect(() => {
    if (editorRef.current) {
      const currentHTML = editorRef.current.getHTML?.()
      if (value !== currentHTML) {
        // Avoid flushSync warning
        setTimeout(() => {
          editorRef.current.commands.setContent(value || '', false)
          setContent(value || '')
        }, 0)
      }
    }
  }, [value])

  return (
    <div className='mt-10'>
      <RichTextEditor
        useEditorOptions={useEditorOptions}
        output='html'
        dark
        content={content}
        disabled={disabled}
        extensions={extensions}
      />
    </div>
  )


}
