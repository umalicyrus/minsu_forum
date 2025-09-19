"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import { useEffect, useState, useCallback } from "react";

export default function RichTextEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (html: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // disable StarterKit’s built-in heading so we can configure our own
        bulletList: false,
        listItem: false,
        paragraph: false,
      }),
      Bold,
      Italic,
      Underline,
      // ✅ add our own configured extensions
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      ListItem,
      Paragraph,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const toggle = useCallback(
    (cmd: string) => {
      if (!editor) return;
      switch (cmd) {
        case "bold":
          editor.chain().focus().toggleBold().run();
          break;
        case "italic":
          editor.chain().focus().toggleItalic().run();
          break;
        case "underline":
          editor.chain().focus().toggleUnderline().run();
          break;
      }
    },
    [editor]
  );

  if (!mounted || !editor) return null;

  return (
    <div className="border border-green-300 rounded-lg">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b bg-green-50">
        <button
          type="button"
          onClick={() => toggle("bold")}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-green-200" : ""
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => toggle("italic")}
          className={`px-2 py-1 rounded italic ${
            editor.isActive("italic") ? "bg-green-200" : ""
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => toggle("underline")}
          className={`px-2 py-1 rounded underline ${
            editor.isActive("underline") ? "bg-green-200" : ""
          }`}
        >
          U
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1 border rounded text-sm ${
            editor.isActive("heading", { level: 2 }) ? "bg-green-200" : ""
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 border rounded text-sm ${
            editor.isActive("bulletList") ? "bg-green-200" : ""
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 border rounded text-sm ${
            editor.isActive("paragraph") ? "bg-green-200" : ""
          }`}
        >
          ¶
        </button>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="min-h-[150px] p-3 focus:outline-none"
      />
    </div>
  );
}
