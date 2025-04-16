import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './RichTextEditor.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}

const RichTextEditor: React.FC<Props> = ({ value, onChange, minHeight = 100 }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate({ editor }: { editor: any }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  return (
    <div className="editorContainer" style={{ minHeight }}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
