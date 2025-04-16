import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';



import './RichTextEditor.css'; // стили ниже

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }: { editor: any }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: 'editorContent',
        },
    },
      
  });

  return (
    <div className="editorContainer">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
